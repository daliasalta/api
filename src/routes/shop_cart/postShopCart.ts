import { Router } from "express";
import { ShopCartInterface } from "../../interfaces/shop_cart.interface";
import ShopCartModel from "../../models/shop_cart.schema";
import ProductModel from "../../models/product.schema";
import { ProductInterface } from "../../interfaces/product.interface";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      amount,
      coupon,
      shipping,
      payment_method,
      items,
      customer_name,
      customer_phone,
      customer_dni,
      customer_email,
      status,
    }: ShopCartInterface = req.body;

    const created_at = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const allShopCarts = await ShopCartModel.find();
    const orderNumber = allShopCarts.length + 1;

    const newShopCart = new ShopCartModel({
      order_number: orderNumber,
      amount,
      coupon,
      shipping,
      payment_method,
      items,
      created_at,
      status,
      customer_name,
      customer_phone,
      customer_dni,
      customer_email,
    });

    // fetch one by one req.body.items to update product stock
    await Promise.all(
      items.map(async (shopCartProduct: any) => {
        // Obtener el producto de la base de datos
        const product: ProductInterface | null = await ProductModel.findById(
          shopCartProduct.product_id
        );

        if (product) {
          // Determinar si el producto tiene tallas (sizes) o no
          if (product.hasSize && product.variants.length) {
            const colorVariant = (product.variants as any[]).find(
              (variant: any) =>
                variant.color.toLowerCase() ===
                shopCartProduct.color.toLowerCase()
            );

            if (colorVariant && Array.isArray(colorVariant.sizes)) {
              const sizeVariant = (colorVariant.sizes as any[]).find(
                (size: any) => size.size === shopCartProduct.size
              );

              if (sizeVariant) {
                const stockFieldPath = `variants.$[colorVariant].sizes.$[sizeVariant].stock`;
                const stockToRefresh = Number(sizeVariant.stock);
                console.log(stockToRefresh);

                // Actualizar el stock del producto
                await ProductModel.findByIdAndUpdate(
                  shopCartProduct.product_id,
                  {
                    $set: {
                      [stockFieldPath]:
                        sizeVariant.stock - shopCartProduct.quantity,
                    },
                  },
                  {
                    new: true,
                    arrayFilters: [
                      { "colorVariant.color": shopCartProduct.color },
                      { "sizeVariant.size": shopCartProduct.size },
                    ],
                  }
                );
              } else {
                console.log(
                  `El tamaño '${shopCartProduct.size}' no existe para el color '${shopCartProduct.color}' en el producto con ID '${shopCartProduct.product_id}'.`
                );
              }
            }
          } else if (!product.hasSize) {
            const colorVariant = (product.variants as any[]).find(
              (variant: any) =>
                variant.color.toLowerCase() ===
                shopCartProduct.color.toLowerCase()
            );

            if (colorVariant) {
              const stockFieldPath = `variants.$[colorVariant].stock`;
              // @ts-ignore
              const stockToRefresh = Number(colorVariant.stock);

              // Actualizar el stock del producto
              await ProductModel.findByIdAndUpdate(
                shopCartProduct.product_id,
                {
                  $set: {
                    [stockFieldPath]: colorVariant.stock - stockToRefresh,
                  },
                },
                {
                  new: true,
                  arrayFilters: [
                    { "colorVariant.color": shopCartProduct.color },
                  ],
                }
              );
            }
          }
        } else {
          console.log(
            `No se encontró el producto con ID '${shopCartProduct.product_id}'.`
          );
        }
      })
    );

    // save shopcart in database
    // Guarda el nuevo shopCart en la base de datos
    const savedShopCart = await newShopCart.save();

    // Popula el campo product_id en cada elemento del array items
    const populatedShopCart = await ShopCartModel.findById(
      savedShopCart._id
    ).populate("items.product_id");

    console.log(populatedShopCart);
    res.status(201).json(populatedShopCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
