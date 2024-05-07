import { Schema, model } from "mongoose";
import { ShopCartInterface } from "../interfaces/shop_cart.interface";

const shopCartSchema = new Schema<ShopCartInterface>({
  amount: {
    type: Number,
    required: [true, "amount is required"],
  },
  shipping: {
    type: {
      shipping_amount: {
        type: Schema.Types.Mixed,
        required: [true, "shipping amount is required"],
      },
      shipping_type: {
        type: String,
        required: [true, "shipping type is required"],
      },
      shipping_customer_info: {
        type: {
          street_neighborhood: {
            type: String,
          },
          number: {
            type: Number,
          },
          apartment: {
            type: Number,
          },
          city: {
            type: String,
          },
          zip_code: {
            type: Number,
          },
          state: {
            type: String,
          },
        },
        required: [false],
      },
    },
    required: [true, "shipping is required"],
  },
  payment_method: {
    type: String,
    required: [true, "payment method is required"],
  },
  items: [
    {
      product_id: {
        type: Schema.Types.ObjectId, // Tipo ObjectId para referencia al modelo Product
        ref: "Product", // Referencia al modelo Product
        required: [true, "item ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "item quantity is required"],
      },
      color: {
        type: String,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
    },
  ],
  created_at: {
    type: String,
  },
  status: {
    type: String,
    default: "not_paid",
  },
  customer_name: {
    type: String,
    required: [true, "custmer_name is required"],
  },
  customer_phone: {
    type: Number,
    required: [true, "customer_phone is required"],
  },
});

const ShopCartModel = model<ShopCartInterface>("ShopCart", shopCartSchema);

export default ShopCartModel;
