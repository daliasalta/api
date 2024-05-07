import { Router } from "express";
import ShopCartModel from "../../models/shop_cart.schema";
// import { ProductInterface } from "../../interfaces/product.interface";
import ProductModel from "../../models/product.schema";
import { validateStockShopCart } from "../../utils/validateStock";
import { ProductInterface } from "../../interfaces/product.interface";

const router = Router();

router.patch("/:shopcart_id", async (req, res) => {
  try {
    const shopcart_id = req.params.shopcart_id;
    const status = req.body.status;
    const shopCartProducts = req.body.stockProducts;
    const oldStatus = req.body.oldStatus;

    const oldStatusIsCanceledOrExpired =
      oldStatus === "canceled" || oldStatus === "expired" ? true : false;

    const newStatusIsCanceledOrExpired =
      status === "canceled" || status === "expired" ? true : false;

    const oldStatusIsPaidOrIsDelivered =
      oldStatus === "paid" || oldStatus === "delivered" ? true : false;
    const newStatusIsPaidOrIsDelivered =
      status === "paid" || status === "delivered" ? true : false;

    // si el stock no cambia porque son del mismo tipo de estado solo cambio el status
    if (
      (oldStatusIsCanceledOrExpired && newStatusIsCanceledOrExpired) ||
      (oldStatusIsPaidOrIsDelivered && newStatusIsPaidOrIsDelivered) ||
      (oldStatus === "not_paid" && newStatusIsPaidOrIsDelivered)
    ) {
      const shopCartToPatch = await ShopCartModel.findByIdAndUpdate(
        shopcart_id,
        { status },
        { new: true } // Esto devuelve el documento actualizado en lugar del antiguo
      );

      res.status(200).send(shopCartToPatch);
    }

    // si oldStatusIsCanceledOrExpired  y quiero pasarlo a paid o delivered le mermo el stock a los productos correspondientes
    else if (oldStatusIsCanceledOrExpired && newStatusIsPaidOrIsDelivered) {
      console.log("ifitems1", shopCartProducts);
      const matchProducts = await Promise.all(
        shopCartProducts.map(async (product: any) => {
          const productDetails: ProductInterface | null =
            await ProductModel.findById(
              product?.product_id?.length > 0
                ? product?.product_id
                : product?.product_id?._id
            );

          if (productDetails === undefined) {
            // Si no se encuentra un producto con el ID proporcionado, puedes manejarlo según tus necesidades
            return {
              id: product._id,
              product: product.product,
              error: "Producto no encontrado",
            };
          }

          if (productDetails && productDetails.hasSize) {
            const variantIndex = productDetails?.variants?.findIndex(
              (variant: any) => variant.color === product.color
            );
            const sizeIndex = productDetails?.variants[
              variantIndex
              // @ts-ignore
            ].sizes?.findIndex((size: any) => size.size === product.size);
            return {
              id: productDetails._id,
              name: productDetails.product,
              product_stock: Number(
                // @ts-ignore
                productDetails.variants[variantIndex].sizes[sizeIndex].stock
              ),
              customer_required_stock: product.quantity,
              size: product.size,
              color: product.color,
            };
          } else if (productDetails && !productDetails?.hasSize) {
            const variantIndex = productDetails?.variants?.findIndex(
              (variant: any) => variant.color === product.color
            );
            return {
              id: productDetails._id,
              name: productDetails.product,
              product_stock: Number(
                // @ts-ignore
                productDetails.variants[variantIndex].stock
              ),
              customer_required_stock: product.quantity,
              color: product.color,
            };
          }
        })
      );

      const missingStock = validateStockShopCart(matchProducts);

      // console.log("missingstockl", missingStock);

      if (missingStock.length === 0) {
        await Promise.all(
          shopCartProducts.map(async (cartProduct: any) => {
            const product: ProductInterface | null =
              await ProductModel.findById(
                cartProduct?.product_id?.length > 0
                  ? cartProduct?.product_id
                  : cartProduct?.product_id?._id
              );

            if (product) {
              console.log("product missingStock === 0 ", product);
              const colorVariant = (product.variants as any[]).find(
                (variant: any) =>
                  variant.color.toLowerCase() ===
                  cartProduct.color.toLowerCase()
              );

              // Determinar si el producto tiene tallas (sizes) o no
              if (product.hasSize && product.variants.length) {
                console.log("colorVariant", colorVariant);
                // @ts-ignore
                if (colorVariant && Array.isArray(colorVariant.sizes)) {
                  // @ts-ignore
                  const sizeVariant = (colorVariant.sizes as any[]).find(
                    (size: any) => size.size === cartProduct.size
                  );
                  console.log("sizeVariant", sizeVariant);

                  if (sizeVariant) {
                    const stockFieldPath = `variants.$[colorVariant].sizes.$[sizeVariant].stock`;

                    // Actualizar el stock del producto
                    await ProductModel.findByIdAndUpdate(
                      cartProduct?.product_id?.length > 0
                        ? cartProduct?.product_id
                        : cartProduct?.product_id?._id,
                      {
                        $set: {
                          [stockFieldPath]:
                            sizeVariant.stock - cartProduct.quantity,
                        },
                      },
                      {
                        new: true,
                        arrayFilters: [
                          { "colorVariant.color": cartProduct.color },
                          { "sizeVariant.size": cartProduct.size },
                        ],
                      }
                    );
                  } else {
                    console.log(
                      `El tamaño '${cartProduct.size}' no existe para el color '${cartProduct.color}' en el producto con ID '${cartProduct.product_id._id}'.`
                    );
                  }
                }
              } else if (!product.hasSize) {
                if (colorVariant) {
                  console.log("else if");
                  const stockFieldPath = `variants.$[colorVariant].stock`;

                  // Actualizar el stock del producto
                  await ProductModel.findByIdAndUpdate(
                    cartProduct?.product_id?.length > 0
                      ? cartProduct?.product_id
                      : cartProduct?.product_id?._id,
                    {
                      $set: {
                        [stockFieldPath]:
                          colorVariant.stock - cartProduct.quantity,
                      },
                    },
                    {
                      new: true,
                      arrayFilters: [
                        { "colorVariant.color": cartProduct.color },
                      ],
                    }
                  );
                }
              }
            }
          })
        );

        const updatedShopCart = await ShopCartModel.findByIdAndUpdate(
          shopcart_id,
          { status },
          { new: true }
        );

        res.status(200).send(updatedShopCart);
      } else if (missingStock.length === 1) {
        const oldProduct = await ShopCartModel.findById(shopcart_id);

        res.status(400).json({
          oldProduct,
          error: `Queda solamente ${
            missingStock[0].stock
          } ${missingStock[0].name.toUpperCase()}, eliminalo del carrito para poder pasarlo a Pagado o Entregado.`,
        });
      } else if (missingStock.length >= 2) {
        const oldProduct = await ShopCartModel.findById(shopcart_id);

        let phrase = missingStock.map((product: any, index: number) => {
          if (product.stock === 0) {
            return `${
              missingStock.length === index + 1 ? "y" : ""
            } Ya no tenes stock de ${product.name.toUpperCase()} `;
          } else {
            return `${missingStock.length === index + 1 ? "y" : ""} Te queda ${
              product.stock
            } ${product.name.toUpperCase()} `;
          }
        });
        res.status(400).json({
          oldProduct,
          error: `${phrase.join(
            ""
          )}, porfavor actualizá los productos de esta orden de compra para poder pasarlo a Pagado o Entregado`,
        });
      }
    }
    // si oldStatusIsPaidOrDelivered y quiero cancelarlo le aumento el stock a los productos de este cart
    else if (
      (oldStatusIsPaidOrIsDelivered && newStatusIsCanceledOrExpired) ||
      (oldStatus === "not_paid" && newStatusIsCanceledOrExpired)
    ) {
      console.log(4);
      console.log("ifitems2", shopCartProducts);
      await Promise.all(
        shopCartProducts.map(async (cartProduct: any) => {
          console.log(cartProduct.product_id._id);
          const product: ProductInterface | null = await ProductModel.findById(
            cartProduct?.product_id?.length > 0
              ? cartProduct?.product_id
              : cartProduct?.product_id?._id
          );
          console.log(product);
          if (product) {
            console.log("there are product");
            const colorVariant = (product.variants as any[]).find(
              (variant: any) =>
                variant.color.toLowerCase() === cartProduct.color.toLowerCase()
            );

            // Determinar si el producto tiene tallas (sizes) o no
            if (product.hasSize) {
              console.log("colorVariant", colorVariant);
              // @ts-ignore
              if (colorVariant && Array.isArray(colorVariant.sizes)) {
                // @ts-ignore
                const sizeVariant = (colorVariant.sizes as any[]).find(
                  (size: any) => size.size === cartProduct.size
                );
                console.log("sizeVariant", sizeVariant);

                if (sizeVariant) {
                  const stockFieldPath = `variants.$[colorVariant].sizes.$[sizeVariant].stock`;
                  const stockToRefresh = Number(sizeVariant.stock);
                  console.log(stockToRefresh);

                  // Actualizar el stock del producto
                  await ProductModel.findByIdAndUpdate(
                    cartProduct?.product_id?._id,
                    {
                      $set: {
                        [stockFieldPath]:
                          sizeVariant.stock + cartProduct.quantity,
                      },
                    },
                    {
                      new: true,
                      arrayFilters: [
                        { "colorVariant.color": cartProduct.color },
                        { "sizeVariant.size": cartProduct.size },
                      ],
                    }
                  );
                } else {
                  console.log(
                    `El tamaño '${cartProduct.size}' no existe para el color '${cartProduct.color}' en el producto con ID '${cartProduct.product_id._id}'.`
                  );
                }
              }
            } else if (!product.hasSize) {
              if (colorVariant) {
                console.log("color variant,", colorVariant);
                console.log("else if");
                const stockFieldPath = `variants.$[colorVariant].stock`;

                // Actualizar el stock del producto
                await ProductModel.findByIdAndUpdate(
                  cartProduct?.product_id?.length > 0
                    ? cartProduct?.product_id
                    : cartProduct?.product_id?._id,
                  {
                    $set: {
                      [stockFieldPath]:
                        colorVariant.stock + cartProduct.quantity,
                    },
                  },
                  {
                    new: true,
                    arrayFilters: [{ "colorVariant.color": cartProduct.color }],
                  }
                );
              }
            }
          }
        })
      );
      const updatedShopCart = await ShopCartModel.findByIdAndUpdate(
        shopcart_id,
        { status },
        { new: true }
      );
      res.status(200).send(updatedShopCart);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default router;
