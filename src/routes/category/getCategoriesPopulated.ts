import { Router } from "express";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    let categories;
    if (CategoryModel.schema.paths.children) {
      categories = await CategoryModel.find().populate({
        path: "children",
        populate: { path: "children" },
      });
    } else {
      categories = await CategoryModel.find();
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
