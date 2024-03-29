import { Router } from "express";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.patch("/:category_id", async (req, res) => {
  try {
    const categoryId = req.params.category_id;
    const updatedCategoryData = req.body;

    // Obtén los IDs de las categorías secundarias desde el cuerpo de la solicitud
    const { children, ...otherUpdates } = updatedCategoryData;

    // Consulta la categoría por su ID
    let existingCategory = await CategoryModel.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Si hay datos actualizados para children, busca manualmente los documentos correspondientes
    if (children) {
      const childrenCategories = await CategoryModel.find({
        _id: { $in: children },
      });

      // Agrega los documentos de children al objeto de fusión principal
      //@ts-ignore
      existingCategory.children = childrenCategories;
    }

    // Fusiona los datos actualizados con los datos existentes de la categoría
    const mergedData = { ...existingCategory.toObject(), ...otherUpdates };

    console.log("merged data", mergedData);

    // Actualiza la categoría principal con los datos fusionados
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      mergedData,
      { new: true }
    );

    console.log("updatedCategory", updatedCategory)
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;