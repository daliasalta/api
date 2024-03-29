import { Router } from "express";
import ProductModel from "../../models/product.schema";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      product,
      price,
      discount_price,
      purchase_price,
      description,
      stock,
      img,
      categories, // Cambiado a 'categories' en lugar de 'category_id'
    } = req.body;

    // Verificar si las categorías existen
    const existingCategories = await CategoryModel.find({ _id: { $in: categories } });
    if (existingCategories.length !== categories.length) {
      return res.status(400).json({ error: "Una o más categorías no encontradas" });
    }

    // Obtener la información completa de cada categoría
    const categoryDetails = existingCategories.map((category) => category.toObject());

    const newProduct = new ProductModel({
      product,
      price,
      discount_price,
      purchase_price,
      description,
      stock,
      img,
      categories: categoryDetails, // Cambiado a incluir la información completa de las categorías
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
