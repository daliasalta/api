import { Schema, model } from "mongoose";
import { CustomerInterface } from "../interfaces/customer.interface";

const customerSchema = new Schema<CustomerInterface>({
  full_name: {
    type: String,
    required: [true, "fullname is required"],
  },
  phone_number: {
    type: String,
    required: [true, "phone number is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [false],
  },
  shipping_info: {
    type: {
      street_neighborhood: {
        type: String,
      },
      number: {
        type: Number,
      },
      apartment: {
        type: String,
      },
      floor: {
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
  },
  orders: {
    type: [Number],
    required: [true, "order is required"],
  },
});

const CustomerModel = model<CustomerInterface>("Customer", customerSchema);

export default CustomerModel;
