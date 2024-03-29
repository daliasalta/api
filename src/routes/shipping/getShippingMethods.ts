import { Router } from "express";
import ShippingModel from "../../models/shipping.schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const shippingMethods = await ShippingModel.find();

    res.status(200).json(shippingMethods);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
