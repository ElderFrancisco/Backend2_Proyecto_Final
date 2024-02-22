import { ProductService } from "../repository/index.js";
import generateProduct from "../util/generateProduct.js";
import { getProductsServices } from "./product.services.js";

export const mockingProducts = async (number) => {
  try {
    for (let i = 0; i < number; i++) {
      const product = generateProduct();
      await ProductService.create(product);
    }
    const productList = await getProductsServices();
    return productList;
  } catch (error) {
    return error;
  }
};
