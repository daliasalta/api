import { Router } from "express";
import { ShopCartInterface } from "../../interfaces/shop_cart.interface";
import ShopCartModel from "../../models/shop_cart.schema";

const router = Router();

router.get("/:order_number", async (req, res) => {
  try {
    const { order_number } = req.params;

    const orders = await ShopCartModel.find();

    const orderToResponse = orders.find(
      (order: ShopCartInterface) => order.order_number === Number(order_number)
    );

    res.json(orderToResponse);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

export default router;
