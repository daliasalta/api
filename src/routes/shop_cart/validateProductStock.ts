import { Router } from "express";
import ProductModel from "../../models/product.schema";
import { validateStockShopCart } from "../../utils/validateStock";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const cartProducts = body.products;

    // Obtener los detalles de los productos desde la base de datos
    const matchProducts = await Promise.all(
      cartProducts.map(async (cartProduct: any) => {
        const productDetails = await ProductModel.findById(cartProduct.id);

        if (!productDetails)
          return {
            id: cartProduct.id,
            stock: null,
          };

        if (productDetails && productDetails?.hasSize) {
          const variantIndex = productDetails?.variants?.findIndex(
            (variant: any) => variant.color === cartProduct.color
          );
          const sizeIndex = productDetails?.variants[
            variantIndex
            // @ts-ignore
          ].sizes?.findIndex((size: any) => size.size === cartProduct.size);
          return {
            id: productDetails.id,
            name: productDetails.product,
            product_stock: Number(
              // @ts-ignore
              productDetails.variants[variantIndex].sizes[sizeIndex].stock
            ),
            customer_required_stock: cartProduct.quantity,
            size: cartProduct.size,
            color: cartProduct.color,
          };
        } else if (productDetails && !productDetails?.hasSize) {
          const variantIndex = productDetails?.variants?.findIndex(
            (variant: any) => variant.color === cartProduct.color
          );
          return {
            id: productDetails.id,
            name: productDetails.product,
            // @ts-ignore
            product_stock: Number(productDetails.variants[variantIndex].stock),
            customer_required_stock: cartProduct.quantity,
            color: cartProduct.color,
          };
        }
      })
    );

    // console.log("cartProducts", matchProducts);

    const missingStock = await validateStockShopCart(matchProducts);

    if (missingStock.length === 0) {
      res.status(200).json(matchProducts);
    } else {
      if (missingStock.length === 1 && missingStock[0].product_stock === 0) {
        res.status(400).json({
          missingStock,
          error: `Ya no tenemos stock de ${missingStock[0].name.toUpperCase()} ${
            missingStock[0].color.toUpperCase()
          } ${missingStock[0].size ?? ""}, porfavor actualice su carrito.`,
        });
      } else if (
        missingStock.length === 1 &&
        missingStock[0].product_stock >= 1
      ) {
        res.status(400).json({
          missingStock,
          error: `Queda solamente ${
            missingStock[0].product_stock
          } ${missingStock[0].name.toUpperCase()} ${missingStock[0].color.toUpperCase()} ${
            missingStock[0].size ?? ""
          } porfavor actualice su carrito.`,
        });
      } else if (missingStock.length >= 2) {
        let phrase = missingStock.map((product: any, index: number) => {
          if (product.product_stock === 0) {
            return `${
              missingStock.length === index + 1 ? "y " : ""
            } Ya no nos quedó ${product.name.toUpperCase()} ${product.color.toUpperCase()} ${
              product.size ?? ""
            } `;
          } else {
            return `${
              missingStock.length === index + 1 ? "y " : " "
            } Nos queda ${
              product.product_stock
            } ${product.name.toUpperCase()} ${product.color.toUpperCase()} ${
              product.size ?? ""
            } `;
          }
        });
        res.status(400).json({
          missingStock,
          error: `${phrase.join("")}, porfavor actualizá tu carrito`,
        });
      }
    }
  } catch (error) {
    console.error("Error en la solicitud POST:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
