import { Router } from "express";
import ProductModel from "../../models/product.schema";
import { ProductInterface } from "../../interfaces/product.interface";
import { validateStock } from "../../utils/validateStock";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const products = body.products;

    // Obtener los detalles de los productos desde la base de datos
    const matchProducts = await Promise.all(
      products.map(async (product: ProductInterface) => {
        const productDetails = await ProductModel.findById(product.id);
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

    const missingStock = await validateStock(matchProducts, products);

    if (missingStock.length === 0) {
      res.status(200).json(matchProducts);
    } else {
      if (missingStock.length === 1 && missingStock[0].stock === 0) {
        res.status(400).json({
          missingStock,
          error: `Ya no tenemos stock de ${missingStock[0].name.toUpperCase()}, porfavor actualice su carrito.`,
        });
      } else if (missingStock.length === 1 && missingStock[0].stock >= 1) {
        res.status(400).json({
          missingStock,
          error: `Queda solamente ${
            missingStock[0].stock
          } ${missingStock[0].name.toUpperCase()} porfavor actualice su carrito.`,
        });
      } else if (missingStock.length >= 2) {
        let phrase = missingStock.map((product: any, index: number) => {
          if (product.stock === 0) {
            return `${
              missingStock.length === index + 1 ? "y" : ""
            } Ya no nos quedó ${product.name.toUpperCase()} `;
          } else {
            return `${missingStock.length === index + 1 ? "y" : ""} Nos queda ${
              product.stock
            } ${product.name.toUpperCase()} `;
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
