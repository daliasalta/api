import { Router } from "express";
import ShopCartModel from "../../models/shop_cart.schema";
// import { ProductInterface } from "../../interfaces/product.interface";
import ProductModel from "../../models/product.schema";
import { validateStock } from "../../utils/validateStock";

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
    } else if (oldStatus === "not_paid" && newStatusIsCanceledOrExpired) {
      const updatedShopCart = await ShopCartModel.findByIdAndUpdate(
        shopcart_id,
        { status },
        { new: true }
      );

      await Promise.allSettled(
        shopCartProducts.map(async (product: any) => {
          const updatedProduct = await ProductModel.findByIdAndUpdate(
            product.product_id,
            { $inc: { stock: product.quantity } },
            { new: true }
          );
          console.log(updatedProduct);
          return updatedProduct;
        })
      );
      res.status(200).send(updatedShopCart);
    }

    // si oldStatusIsCanceledOrExpired  y quiero pasarlo a paid o delivered le mermo el stock a los productos correspondientes
    else if (oldStatusIsCanceledOrExpired && newStatusIsPaidOrIsDelivered) {
      const matchProducts = await Promise.all(
        shopCartProducts.map(async (product: any) => {
          const productDetails = await ProductModel.findById(
            product?.product_id?._id
          );

          if (!productDetails) {
            // Si no se encuentra un producto con el ID proporcionado, puedes manejarlo según tus necesidades
            return {
              id: product.id,
              product: product.product,
              error: "Producto no encontrado",
            };
          }

          // Devolver los detalles del producto junto con la cantidad
          return {
            id: productDetails.id,
            name: productDetails.product,
            stock: productDetails.stock,
          };
        })
      );

      const requiredProducts = shopCartProducts.map((product: any) => {
        return {
          id: product.product_id._id,
          quantity: product.quantity,
        };
      });

      const missingStock = validateStock(matchProducts, requiredProducts);

      if (missingStock.length === 0) {
        await Promise.all(
          shopCartProducts.map(async (productCart: any) => {
            // const productId = productCart.product_id;
            // const stock;
            console.log("productCart", productCart);
            const updatedProduct = await ProductModel.findByIdAndUpdate(
              productCart.product_id,
              { $inc: { stock: -productCart.quantity } }
            );
            return updatedProduct;
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
    else if (oldStatusIsPaidOrIsDelivered && newStatusIsCanceledOrExpired) {
      console.log(4);
      const updatedShopCart = await ShopCartModel.findByIdAndUpdate(
        shopcart_id,
        { status },
        { new: true }
      );

      await Promise.all(
        shopCartProducts.map(async (productCart: any) => {
          const updatedProduct = await ProductModel.findByIdAndUpdate(
            productCart.product_id,
            { $inc: { stock: productCart.quantity } }
          );
          return updatedProduct;
        })
      );
      res.status(200).send(updatedShopCart);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default router;
