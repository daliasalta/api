import { Router } from "express";
import ProductModel from "../../models/product.schema";

const router = Router();

router.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Verifica si el ID proporcionado es válido
    if (!productId) {
      return res
        .status(400)
        .json({ message: "ID de producto no proporcionado" });
    }

    // Utiliza el método findByIdAndRemove para eliminar el producto por ID
    const deletedProduct = await ProductModel.findByIdAndRemove(productId);
    console.log(deletedProduct);
    // Verifica si el producto se encontró y eliminó con éxito
    if (deletedProduct) {
      const updatedProducts = await ProductModel.find();

      return res
        .status(200)
        .json({
          message: "Producto eliminado con éxito",
          products: updatedProducts,
        });
    } else {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
