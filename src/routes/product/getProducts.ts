import { Router } from "express";
import ProductModel from "../../models/product.schema";

const router = Router();

router.get("/:limit?", async (req, res) => {
  try {
    let limitValue = req.params.limit;
    // let query = ProductModel.find({ stock: { $gt: 0 } }).sort({ _id: -1 }); // Ordena en orden descendente por el campo _id
    let query = ProductModel.find().sort({ _id: -1 }); // Ordena en orden descendente por el campo _id

    if (limitValue) {
      query = query.limit(parseInt(limitValue, 10));
    }

    const products = await query.populate("categories").exec();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
