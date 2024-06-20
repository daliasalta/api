export type ShopCartStatus = "not_paid" | "expired" | "paid" | "delivered";

export type ShippingCustomerInfoType = {
  street_neighborhood: string;
  number: number;
  apartment: string;
  floor: number
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

export type CouponType = {
  discount_amount: number;
  coupon_code: string;
};

export interface ShopCartInterface {
  order_number: number;
  amount: number;
  coupon?: CouponType;
  shipping: ShippingType;
  payment_method: string;
  items: ShopCartItemsType[];
  created_at: string;
  status: ShopCartStatus;
  customer_name: string;
  customer_phone: number;
  customer_email: string;
  customer_dni: number;
}
