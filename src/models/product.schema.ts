import { Schema, model } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";

const productSchema = new Schema<ProductInterface>(
  {
    product: {
      type: String,
      required: [true, "product name is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    discount_price: {
      type: Number,
      required: false,
    },
    purchase_price: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    isFeatured: {
      type: Boolean,
    },
    img: {
      type: String,
      required: [true, "image is required"],
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "at least one category is required"],
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = model<ProductInterface>("Product", productSchema);

export default ProductModel;
