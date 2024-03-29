import { Router } from "express";
import ShippingModel from "../../models/shipping.schema";

const router = Router();

router.patch("/:shipping_id", async (req, res) => {
  try {
    const { shipping_id } = req.params;
    const updatedShipping = req.body;

    console.log(updatedShipping);

    const updatedShippingData = await ShippingModel.findByIdAndUpdate(
      shipping_id,
      updatedShipping,
      {
        new: true,
      }
    );

    console.log(updatedShippingData);
    if (!updatedShippingData && updatedShippingData !== undefined) {
      return res.status(404).json({ message: "Método de envío no encontrado" });
    }
    res.status(200).json({ message: "Envío actualizado", shipping: updatedShippingData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
