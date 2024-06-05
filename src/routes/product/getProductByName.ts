import { Router } from "express";
import ProductModel from "../../models/product.schema";
import { getProductByQuery } from "../../utils/getProductByQuery";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const queryValue = req.query.product;

    console.log(queryValue);

    if (!queryValue) {
      return res
        .status(400)
        .json({ error: "Falta el parámetro product en la URL" });
    }

    // const products = await ProductModel.find({ stock: { $gt: 0 } });
    const products = await ProductModel.find();
    const similarProducts = getProductByQuery(products, queryValue);

    if (similarProducts.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos con este nombre" });
    }
    // console.log(similarProducts)

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
