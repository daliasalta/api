import { Router } from "express";
import ShopCartModel from "../../models/shop_cart.schema";

const router = Router();

router.get("/:order_number", async (req, res) => {
  try {
    const { order_number } = req.params;

    // Buscar el carrito de compras utilizando order_number y aplicar populate
    const shopCart = await ShopCartModel.findOne({
      order_number: Number(order_number),
    }).populate({
      path: "items.product_id",
      populate: {
        path: "categories",
      },
    });

    if (!shopCart) {
      return res
        .status(404)
        .json({ error: "Carrito de compras no encontrado" });
    }

    // Contar el número total de carritos de compras en la base de datos
    const shopCartLength = await ShopCartModel.countDocuments();

    res.status(200).json({
      data: shopCart,
      shopCartLength: shopCartLength,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito de compras" });
  }
});

export default router;
