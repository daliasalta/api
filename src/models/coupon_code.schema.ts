import { Schema, model } from "mongoose";
import { CouponCodeInterface } from "../interfaces/coupon_code.interface";

const couponCodeSchema = new Schema<CouponCodeInterface>({
  coupon_name: {
    type: String,
    required: [true, "coupon name is required"],
  },
  discount: {
    type: Number,
    required: [true, "coupon discount is required"],
  },
  uses: {
    type: Number,
    required: [true, "coupon uses is required"],
  },
});
const CouponCodeModel = model<CouponCodeInterface>(
  "Coupon_code",
  couponCodeSchema
);

export default CouponCodeModel;
