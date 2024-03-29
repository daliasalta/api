// En tu archivo de rutas
import { Router } from "express";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.delete("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Verifica si el ID proporcionado es válido
    if (!categoryId) {
      return res
        .status(400)
        .json({ message: "ID de category no proporcionado" });
    }

    // Utiliza el método findByIdAndRemove para eliminar la categoría por ID
    const deletedCategory = await CategoryModel.findByIdAndRemove(categoryId);

    // Verifica si la categoría se encontró y eliminó con éxito
    if (deletedCategory) {
      // Después de eliminar la categoría, obtén la lista actualizada de categorías
      const updatedCategories = await CategoryModel.find();

      return res.status(200).json({
        message: "Categoría eliminada con éxito",
        categories: updatedCategories,
      });
    } else {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
