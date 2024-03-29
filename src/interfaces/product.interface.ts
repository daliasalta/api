import { Document } from "mongoose";
import { CategoryInterface } from "./category.interface";

export interface ProductInterface extends Document {
  product: string;
  price: number;
  discount_price: number;
  purchase_price?: number;
  description: string;
  stock: number;
  isFeatured: boolean;
  img: string;
  categories: CategoryInterface;
}
