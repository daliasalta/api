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
      isFeatured,
      description,
      hasSize,
      hasColors,
      categories,
      variants,
    } = req.body;

    // Verificar si las categorías existen
    const existingCategories = await CategoryModel.find({
      _id: { $in: categories },
    });
    if (existingCategories.length !== categories.length) {
      return res
        .status(400)
        .json({ error: "Una o más categorías no encontradas" });
    }

    const categoryDetails = existingCategories.map((category) =>
      category.toObject()
    );

    const newProduct = new ProductModel({
      product,
      price,
      discount_price,
      purchase_price,
      isFeatured,
      description,
      hasSize,
      hasColors,
      categories: categoryDetails,
      variants,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
