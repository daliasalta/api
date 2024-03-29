import { Router } from "express";
import ProductModel from "../../models/product.schema";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.get("/:category_name", async (req, res) => {
  try {
    let { category_name } = req.params;

    // Decodificar el nombre de la categoría
    category_name = category_name.split("-").join(" ");

    // Buscar la categoría por el nombre (insensible a mayúsculas y minúsculas)
    const category = await CategoryModel.findOne({
      category_name: {
        $regex: new RegExp(category_name.replace(/\s+/g, "\\s*"), "i"),
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoría sin productos" });
    }

    const products = await ProductModel.find({
      categories: { $in: [category._id] },
      stock: { $gt: 0 },
    })
      .populate({
        path: "categories",
        model: "Category", // Modelo de la categoría
      })
      .exec();

    // Verificar si no se encontraron productos
    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos en esta categoría" });
    }

    // Asegurarse de que siempre se envíe un array
    const productsArray = Array.isArray(products) ? products : [products];

    res.status(200).send(productsArray);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
