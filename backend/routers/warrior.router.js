import { Router } from "express";
import warriorController from "../controllers/warrior.controller.js";
import { uploadSingle, handleMulterError } from "../config/multer.js";

const router = Router();

// Admin routes (require admin permissions - will be protected in app.js)
router.post("/warrior", uploadSingle('image'), warriorController.create);
router.get("/warrior/:id", warriorController.findById);
router.put("/warrior/:id", uploadSingle('image'), warriorController.update);
router.post("/warrior/:id/upload-image", uploadSingle('image'), warriorController.uploadImage);
router.delete("/warrior/:id", warriorController.delete);
router.patch("/warrior/:id/toggle-availability", warriorController.toggleAvailability);
router.post("/warrior/:id/powers", warriorController.addPowers);
router.delete("/warrior/:id/powers", warriorController.removePowers);

// Error handling middleware
router.use(handleMulterError);

export default router;
