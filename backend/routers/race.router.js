import { Router } from "express";
import raceController from "../controllers/race.controller.js";
import { uploadSingle, handleMulterError } from "../config/multer.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/race", uploadSingle('image'), raceController.create);
router.get("/race/:id", raceController.findById);
router.put("/race/:id", uploadSingle('image'), raceController.update);
router.post("/race/:id/upload-image", uploadSingle('image'), raceController.uploadImage);
router.delete("/race/:id", raceController.delete);

// Error handling middleware
router.use(handleMulterError);

export default router;
