import { Router } from "express";
import { DollarPriceInterface } from "../../interfaces/dollar_price.interface";
import DollarPriceModel from "../../models/dollar_price.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { month, year, price }: DollarPriceInterface = req.body;

    const newDollarPrice = new DollarPriceModel({
      month,
      year,
      price,
    });

    const savedDollarPrice = await newDollarPrice.save();

    res.status(201).json(savedDollarPrice);
  } catch (error) {
    console.log(error);
  }
});

export default router;
