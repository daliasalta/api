import { Router } from "express";
import CategoryModel from "../../models/category.schema";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await CategoryModel.find({ primary: true });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
