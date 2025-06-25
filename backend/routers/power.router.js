import { Router } from "express";
import powerController from "../controllers/power.controller.js";
import { uploadSingle, handleMulterError } from "../config/multer.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/power", uploadSingle('image'), powerController.create);
router.get("/power/:id", powerController.findById);
router.put("/power/:id", uploadSingle('image'), powerController.update);
router.post("/power/:id/upload-image", uploadSingle('image'), powerController.uploadImage);
router.delete("/power/:id", powerController.delete);

// Error handling middleware
router.use(handleMulterError);

export default router;
