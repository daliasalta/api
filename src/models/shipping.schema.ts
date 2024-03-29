import { Schema, model } from "mongoose";
import {
  PaymentMethod,
  ShippingInterface,
} from "../interfaces/shipping.interface";

const paymentMethodsEnum: PaymentMethod[] = ["cash", "bank_transfer"];

const shippingSchema = new Schema<ShippingInterface>({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
  },
  price: {
    type: Schema.Types.Mixed,
    required: [true, "price is required"],
  },
  require_customer_shipping_info: {
    type: Boolean,
    required: [true, "customer shipping info is required"],
  },
  payment_methods_allowed: {
    type: [
      {
        type: String,
        enum: paymentMethodsEnum,
      },
    ],
    required: [true, "payment_methods_allowed must be provided"],
  },
});

const ShippingModel = model<ShippingInterface>("Shipping", shippingSchema);

export default ShippingModel;
