import { ShippingCustomerInfoType } from "./shop_cart.interface";

export interface CustomerInterface {
  full_name: string;
  phone_number: string;
  email: string;
  password?: string;
  shipping_info: ShippingCustomerInfoType;
  orders: string[];
}
