import { Router } from "express";
import cloudinary from "../../services/cloudinary-connection";

const router = Router();

router.post("/", async (req: any, res: any) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
      folder: "dalia",
    });

    console.log("response upload image", uploadedResponse)
    res.json(uploadedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar la imagen" });
  }
});

export default router;

