import { ProductService } from "../repository/index.js";

function getUrl(params, path, number) {
  const nextPage = parseInt(params.page) + number;

  let url = `${path}?page=${nextPage >= 1 ? nextPage : 1}`;
  if (params.limit !== 10) {
    url += `&limit=${params.limit}`;
  }
  if (params.query != null) {
    url += `&query=${JSON.stringify(params.query)}`;
  }
  if (params.sort != null) {
    url += `&sort=${JSON.stringify(params.sort)}`;
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

// async getProducts(params, pathUrl) {
//   try {
//     const urlPrev = getUrl(params, pathUrl, -1);
//     const urlNext = getUrl(params, pathUrl, +1);
//     //const productsList = await ProductsDaoManager.getAllPaginate(params);
//     const productsList = await ProductService.paginate(params);
//     const result = createResult(productsList, "success", urlPrev, urlNext);
//     return result;
//   } catch (error) {
//     return error;
//   }
// }
export const getProductsServices = async (params, pathUrl) => {
  try {
    const urlPrev = getUrl(params, pathUrl, -1);
    const urlNext = getUrl(params, pathUrl, +1);
    //const productsList = await ProductsDaoManager.getAllPaginate(params);
    const productsList = await ProductService.paginate(params);
    const result = createResult(productsList, "success", urlPrev, urlNext);
    return result;
  } catch (error) {
    return error;
  }
};
