import { Router } from "express";
import { ShopCartInterface } from "../../interfaces/shop_cart.interface";
import ShopCartModel from "../../models/shop_cart.schema";
import ProductModel from "../../models/product.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      amount,
      shipping,
      payment_method,
      items,
      customer_name,
      customer_phone,
      status,
    }: ShopCartInterface = req.body;
    
    const created_at = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const newShopCart = new ShopCartModel({
      amount,
      shipping,
      payment_method,
      items,
      created_at,
      status,
      customer_name,
      customer_phone,
    });


    // fetch one by one req.body.items to update product stock
    await Promise.all(
      items.map(async (shopCartProduct: any) => {
        const stockToRefresh = shopCartProduct.quantity;

        await ProductModel.findByIdAndUpdate(
          shopCartProduct.product_id,
          { $inc: { stock: -stockToRefresh } },
          { new: true } // Para devolver el documento actualizado
        );
      })
    );

    // save shopcart in database
    const savedShopCart = await newShopCart.save();
    res.status(201).json(savedShopCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
