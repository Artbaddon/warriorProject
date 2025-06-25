import { Router } from "express";
import magicController from "../controllers/magic.controller.js";
import { uploadSingle, handleMulterError } from "../config/multer.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/magic", uploadSingle('image'), magicController.create);
router.get("/magic/:id", magicController.findById);
router.put("/magic/:id", uploadSingle('image'), magicController.update);
router.post("/magic/:id/upload-image", uploadSingle('image'), magicController.uploadImage);
router.delete("/magic/:id", magicController.delete);

// Error handling middleware
router.use(handleMulterError);

export default router;
