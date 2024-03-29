import { Router } from "express";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      category_name,
      category_description,
      isFather,
      isChildren,
      isHighlighted,
      img,
    } = req.body;

    const newCategory = new CategoryModel({
      category_name,
      category_description: category_description || null,
      isFather: isFather,
      isChildren: isChildren || false,
      isHighlighted: isHighlighted || false,
      img: img || null,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
