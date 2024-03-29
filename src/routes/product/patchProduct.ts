import { Router } from "express";
import ProductModel from "../../models/product.schema";

const router = Router();

router.patch("/:product_id", async (req, res) => {
  try {
    const productId = req.params.product_id; // Obtén el ID del producto a actualizar desde la URL

    // Obtén los datos que se enviarán en el cuerpo de la solicitud (req.body)
    const updatedProductData = req.body;
    console.log(updatedProductData)
    // Realiza la actualización del producto en la base de datos utilizando Mongoose
    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedProductData, {
      new: true, // Esto devuelve el documento actualizado en la respuesta
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
