export type ShopCartStatus = "not_paid" | "expired" | "paid" | "delivered";

export type ShippingCustomerInfoType = {
  street_neighborhood: string;
  number: number;
  apartment: number;
  city: string;
  zip_code: number;
  state: string;
};

export type ShippingType = {
  amount: number;
  type: string;
  shipping_customer_info?: ShippingCustomerInfoType;
};

export type ShopCartItemsType = {
  id: string;
  quantity: number;
};

export interface ShopCartInterface {
  order_number: number;
  amount: number;
  shipping: ShippingType;
  payment_method: string;
  items: ShopCartItemsType[];
  created_at: string;
  status: ShopCartStatus;
  customer_name: string;
  customer_phone: number;
}
