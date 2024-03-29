import { Router } from "express";
import ShippingModel from "../../models/shipping.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      require_customer_shipping_info,
      payment_methods_allowed,
    } = req.body;

    console.log(req.body)

    const newShipping = await new ShippingModel({
      title,
      description,
      price,
      require_customer_shipping_info,
      payment_methods_allowed,
    });

    await newShipping.save();

    const allShippingMethods = await ShippingModel.find();
    res.status(201).json(allShippingMethods);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
});

export default router;
