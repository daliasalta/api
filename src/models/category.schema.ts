import { Schema, model } from "mongoose";
import { CategoryInterface } from "../interfaces/category.interface";

const categorySchema = new Schema<CategoryInterface>({
  category_name: {
    type: String,
    required: [true, "category name is required"],
  },
  category_description: {
    type: String,
  },
  isFather: {
    type: Boolean,
  },
  isChildren: {
    type: Boolean,
  },
  isHighlighted: {
    type: Boolean,
  },
  img: {
    type: String,
    required: false,
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: "Category",
  }],
}, { strict: false }); // Deshabilita el strict mode

const CategoryModel = model<CategoryInterface>("Category", categorySchema);

export default CategoryModel;
