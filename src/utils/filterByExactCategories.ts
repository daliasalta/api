import { CategoryInterface } from "../interfaces/category.interface";
import { ProductInterface } from "../interfaces/product.interface";

export const filterByExactCategories = (
  categoriesToMatch: string[],
  products: ProductInterface[]
) => {
  const isSomeCategoryMissing = (productCategories: any) => {
    return productCategories.some(
      (category: CategoryInterface) =>
        !categoriesToMatch.includes(category.category_name.toLowerCase().trim())
    );
  };

  const matchSingleCategory = (productCategories: any) => {
    return productCategories.some((category: CategoryInterface) =>
      categoriesToMatch.includes(category.category_name.toLowerCase().trim())
    );
  };

  if (categoriesToMatch.length === 1) {
    const filteredProducts = products.filter((product: ProductInterface) =>
      matchSingleCategory(product.categories)
    );
    return filteredProducts;
  } else {
    const filteredProducts = products.filter(
      (product: ProductInterface) => !isSomeCategoryMissing(product.categories)
    );
    return filteredProducts;
  }
};
