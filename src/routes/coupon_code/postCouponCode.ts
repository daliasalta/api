import { Router } from "express";
import { CouponCodeInterface } from "../../interfaces/coupon_code.interface";
import CouponCodeModel from "../../models/coupon_code.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    console.log("body", req.body)
    const { coupon_name, uses, discount }: CouponCodeInterface = req.body;

    const newCouponCode = new CouponCodeModel({
      coupon_name,
      uses,
      discount,
    });

    const savedCouponCode = await newCouponCode.save();

    res.status(201).json(savedCouponCode);
  } catch (error) {
    res.status(500).send(error);
    console.log(error)
  }
});

export default router;
