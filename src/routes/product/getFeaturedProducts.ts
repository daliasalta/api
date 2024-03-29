import { Router } from "express";
import ProductModel from "../../models/product.schema";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
      stock: { $gt: 0 },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
