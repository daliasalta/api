import { Router } from "express";
import ShopCartModel from "../../models/shop_cart.schema";

const router = Router();
router.get("/", async (req, res) => {
  try {
    const shopCarts = await ShopCartModel.find()
      .populate({
        path: 'items.product_id',
        populate: {
          path: 'categories'
        }
      });

    res.status(200).json(shopCarts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
