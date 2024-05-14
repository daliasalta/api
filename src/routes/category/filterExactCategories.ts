import { Router } from "express";
import ProductModel from "../../models/product.schema";
import { filterByExactCategories } from "../../utils/filterByExactCategories";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let categorias: any = req.query.category;
    // Si categorias no es un array, lo convertimos a un array con un solo elemento
    if (!Array.isArray(categorias)) {
      categorias = [categorias];
    }
    console.log(categorias);
    const categoryArray = categorias.map((category: any) =>
      category?.toLowerCase().trim()
    );

    // const productos = await ProductModel.find({ stock: { $gt: 0 } }).populate({
    const productos = await ProductModel.find().populate({
      path: "categories",
    });

    const response = filterByExactCategories(categoryArray, productos);

    if (!response.length) {
      return res.status(404).json({
        error: "No encontramos categorías que coincidan con la búsqueda",
      });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});

export default router;
