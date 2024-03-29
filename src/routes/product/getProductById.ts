import { Router } from "express";
import mongoose from "mongoose"; // Asegúrate de importar mongoose para usar el ObjectId
import ProductModel from "../../models/product.schema";

const router = Router();

router.get("/:product_id", async (req: any, res: any) => {
  const product_id = req.params.product_id;

  // Verificar si el product_id es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return res.status(400).json({ error: "ID de producto no válido" });
  }

  try {
    const product = await ProductModel.findById(product_id).populate("categories");
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    console.log("product:", product.product);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

export default router;
