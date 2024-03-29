import CouponCodeModel from "../../models/coupon_code.schema";

import { Router } from "express";
const router = Router();

// Ruta para validar un cupón
router.post("/", async (req: any, res: any) => {
  try {
    const { couponCode } = req.body;

    const coupon = await CouponCodeModel.findOne({
      coupon_name: couponCode.toUpperCase(),
    });

    console.log(coupon);

    if (coupon?.uses! > 0) {
      await CouponCodeModel.findOneAndUpdate(
        { coupon_name: couponCode.toUpperCase() },
        { $inc: { uses: -1 } },
        { new: true }
      );

      res
        .status(200)
        .json({couponData: coupon });
    } else {
      res.status(400).json({ error: "Cupón no válido" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la validación del cupón" });
  }
});

export default router;
