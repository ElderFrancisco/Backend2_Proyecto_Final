import { CartService } from "../repository/index.js";

function getUrl(params, path, number) {
  const nextPage = parseInt(params.page) + number;

  let url = `${path}?page=${nextPage >= 1 ? nextPage : 1}`;

  if (params.limit !== 10) {
    url += `&limit=${params.limit}`;
  }
  return url;
}
function createResult(doc, state, urlPrev, urlNext) {
  const result = {
    status: state,
    payload: doc.docs,
    totalPages: doc.totalPages,
    prevPage: doc.prevPage,
    nextPage: doc.nextPage,
    page: doc.page,
    hasPrevPage: doc.hasPrevPage,
    hasNextPage: doc.hasNextPage,
    prevLink: doc.hasPrevPage == true ? urlPrev : null,
    nextLink: doc.hasNextPage == true ? urlNext : null,
  };
  return result;
}

export default class CartServices {
  async getCarts(params, pathUrl) {
    try {
      const urlPrev = getUrl(params, pathUrl, -1);
      const urlNext = getUrl(params, pathUrl, +1);
      const cartList = await CartService.paginate(params);
      const result = createResult(cartList, "success", urlPrev, urlNext);
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateOneCart(cid, pid) {
    try {
      const cartToUpdate = await CartService.getByID(cid);
      if (!cartToUpdate) return null;
      const indexProduct = cartToUpdate.products.findIndex((product) => {
        return product.product._id == pid;
      });
      if (indexProduct >= 0) {
        cartToUpdate.products[indexProduct].quantity++;
      } else {
        cartToUpdate.products.push({ product: pid, quantity: 1 });
      }
      const result = await CartService.update(cartToUpdate);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteProductCart(cid, pid) {
    try {
      const cartToUpdate = await CartService.getByID(cid);
      if (!cartToUpdate) return null;
      const indexProduct = cartToUpdate.products.findIndex((product) => {
        return product.product._id == pid;
      });

      if (indexProduct >= 0) {
        if (cartToUpdate.products[indexProduct].quantity == 1) {
          cartToUpdate.products.splice(indexProduct, 1);
        } else cartToUpdate.products[indexProduct].quantity--;
      } else {
        return null;
      }
      const result = CartService.update(cartToUpdate);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateManyProducts(cid, products) {
    try {
      const cartToUpdate = await CartService.getByID(cid);
      if (!cartToUpdate) return null;
      products.forEach((productFull) => {
        const indexProduct = cartToUpdate.products.findIndex((product) => {
          return product.product._id == productFull.product;
        });
        if (indexProduct >= 0) {
          cartToUpdate.products[indexProduct].quantity += productFull.quantity;
        } else {
          let quantityOfProduct = 1;
          if (productFull.quantity !== null || productFull.quantity !== 0) {
            quantityOfProduct = productFull.quantity;
          }
          cartToUpdate.products.push({
            product: productFull.product,
            quantity: quantityOfProduct,
          });
        }
      });
      const result = CartService.update(cartToUpdate);
      return result;
    } catch (error) {
      return error;
    }
  }
}
