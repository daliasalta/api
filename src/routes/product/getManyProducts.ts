import { Router } from "express";
import ProductModel from "../../models/product.schema";

const router = Router();

router.post("/", async (req: any, res: any) => {
  const productIds = req.body.ids as string[];
  try {
    const products = await ProductModel.find({ _id: { $in: productIds } }).populate('categories');
    res.json(products);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

export default router;
