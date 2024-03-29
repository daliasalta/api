import { Schema, model } from "mongoose";
import { DollarPriceInterface } from "../interfaces/dollar_price.interface";

const dollarPriceSchema = new Schema<DollarPriceInterface>({
  month: {
    type: Number,
    required: [true, "month is required"],
  },
  year: {
    type: Number,
    required: [true, "year is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
});

const DollarPriceModel = model<DollarPriceInterface>(
  "Dollar_price",
  dollarPriceSchema
);

export default DollarPriceModel;
