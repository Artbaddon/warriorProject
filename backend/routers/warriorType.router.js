import { Router } from "express";
import warriorTypeController from "../controllers/warriorType.controller.js";
import { uploadSingle, handleMulterError } from "../config/multer.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/warrior-type", uploadSingle('image'), warriorTypeController.create);
router.get("/warrior-type/:id", warriorTypeController.findById);
router.put("/warrior-type/:id", uploadSingle('image'), warriorTypeController.update);
router.post("/warrior-type/:id/upload-image", uploadSingle('image'), warriorTypeController.uploadImage);
router.delete("/warrior-type/:id", warriorTypeController.delete);

// Error handling middleware
router.use(handleMulterError);

export default router;
