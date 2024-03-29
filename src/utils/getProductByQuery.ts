import { ProductInterface } from "../interfaces/product.interface";

export const getProductByQuery = (
  products: ProductInterface[],
  productQuery: any,
): ProductInterface[] => {
  const similarProducts = [];

  for (const product of products) {
    if (product.product.includes(productQuery)) {
      similarProducts.push(product);
    }
  }
  return similarProducts;
};
  