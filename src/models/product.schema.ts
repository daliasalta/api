import { Schema, model } from "mongoose";
import {
  ProductInterface,
  // ProductVariantWithSizes,
  // ProductVariantWithoutSizes,
} from "../interfaces/product.interface";

// const productVariantWithSizesSchema = new Schema<ProductVariantWithSizes>({
//   sizes: [
//     {
//       size: { type: Number, required: true },
//       stock: { type: Number, required: true },
//     },
//   ],
//   color: { type: String, required: true },
//   images: [
//     {
//       main: { type: String, required: true },
//       secondary: { type: String },
//       terciary: { type: String },
//     },
//   ],
// });

// const productVariantWithoutSizesSchema = new Schema<ProductVariantWithoutSizes>(
//   {
//     stock: { type: Number, required: true },
//     color: { type: String, required: true },
//     images: [
//       {
//         main: { type: String, required: true },
//         secondary: { type: String },
//         terciary: { type: String },
//       },
//     ],
//   }
// );

const productSchema = new Schema<ProductInterface>(
  {
    product: { type: String, required: [true, "product name is required"] },
    price: { type: Number, required: [true, "price is required"] },
    discount_price: { type: Number, required: false },
    purchase_price: { type: Number, required: false },
    description: { type: String, required: [true, "description is required"] },
    isFeatured: { type: Boolean },
    hasSize: { type: Boolean },
    hasManyColors: { type: Boolean },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "at least one category is required"],
      },
    ],
    variants: {
      type: Schema.Types.Mixed,
      required: [true, "price is required"],
    },
  },
  { timestamps: true }
);

const ProductModel = model<ProductInterface>("Product", productSchema);

export default ProductModel;
