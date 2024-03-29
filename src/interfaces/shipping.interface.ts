export type PaymentMethod = "cash" | "bank_transfer" | "crypto";

export interface ShippingInterface {
  title: string;
  description: string;
  price: number;
  require_customer_shipping_info: boolean;
  payment_methods_allowed: PaymentMethod[];
}
