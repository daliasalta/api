import { Router } from "express";
import CustomerModel from "../../models/customer.schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const customers = await CustomerModel.aggregate([
      {
        $addFields: {
          ordersCount: { $size: "$orders" }
        }
      },
      {
        $sort: { ordersCount: -1 }
      }
    ]);

    res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

export default router;
