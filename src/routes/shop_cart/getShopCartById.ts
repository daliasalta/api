import { Router } from "express";
import ShopCartModel from "../../models/shop_cart.schema";
// import { ProductInterface } from "../../interfaces/product.interface";
// import { ProductInterface } from "src/interfaces/product.interface"

const router = Router();

router.get("/:id_shopcart", async (req, res) => {
  try {
    const id_shopcart = req.params.id_shopcart;

    const shopCart = await ShopCartModel.findById(id_shopcart).populate({
      path: "items.product_id",
      populate: {
        path: "categories",
      },
    });

    console.log(shopCart);
    res.status(200).send(shopCart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito de compras" });
  }
});

export default router;
