import { Router } from "express";
import CustomerModel from "../../models/customer.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { full_name, phone_number, email, shipping_info, orders } = req.body;

    const newCustomer = new CustomerModel({
      full_name,
      phone_number,
      email,
      shipping_info,
      orders,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json({
      message: "Cliente creado correctamente",
      customer: savedCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

export default router;
