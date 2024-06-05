import { Router } from "express";
import ProductModel from "../../models/product.schema";
import { ProductInterface } from "../../interfaces/product.interface";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productsWithDiscount: ProductInterface[] = await ProductModel.find({
      discount_price: { $gt: 0 },
      // stock: { $gt: 0 },
    });

    if (productsWithDiscount.length) {
      console.log(productsWithDiscount);
      res.status(200).json(productsWithDiscount);
    } else {
      res
        .status(404)
        .json({ error: "No hay productos en oferta en este momento" });
    }
  } catch (error) {
    console.error("Error fetching products with discount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
