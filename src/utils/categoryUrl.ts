export const decodeCategoryUrl = (category: string) => {
  return category.split("-").join(" ");
};