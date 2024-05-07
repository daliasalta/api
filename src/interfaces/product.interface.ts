import { Document } from "mongoose";
import { CategoryInterface } from "./category.interface";

export interface ProductInterface extends Document {
  product: string;
  price: number;
  discount_price: number;
  purchase_price?: number;
  description: string;
  isFeatured: boolean;
  hasSize: boolean;
  hasManyColors: boolean;
  categories: CategoryInterface;
  variants: ProductVariantWithSizes[] | ProductVariantWithoutSizes[];
}

export type ProductVariantWithSizes = {
  sizes: [{ size: number; stock: number }];
  color: string;
  images: [
    {
      main: string;
      secondary?: string;
      terciary?: string;
    }
  ];
};

export type ProductVariantWithoutSizes = {
  stock: number;
  color: string;
  images: [
    {
      main: string;
      secondary?: string;
      terciary?: string;
    }
  ];
};
