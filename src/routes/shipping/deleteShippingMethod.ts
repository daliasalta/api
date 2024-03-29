import { Router } from "express";
import ShippingModel from "../../models/shipping.schema";

const router = Router();

router.delete("/:shipping_id", async (req, res) => {
  try {
    const { shipping_id } = req.params;

    const deleteShippingMethod = await ShippingModel.findByIdAndRemove(
      shipping_id
    );

    if (deleteShippingMethod) {
      const updatedShipping = await ShippingModel.find();

      return res.status(200).json({
        message: "Método de entrega eliminado con éxito",
        shipping: updatedShipping,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Método de entrega no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
