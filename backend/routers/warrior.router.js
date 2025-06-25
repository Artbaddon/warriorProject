import { Router } from "express";
import warriorController from "../controllers/warrior.controller.js";

const router = Router();

// Admin routes (require admin permissions - will be protected in app.js)
router.post("/warrior", warriorController.create);
router.get("/warrior/:id", warriorController.findById);
router.put("/warrior/:id", warriorController.update);
router.delete("/warrior/:id", warriorController.delete);
router.patch("/warrior/:id/toggle-availability", warriorController.toggleAvailability);
router.post("/warrior/:id/powers", warriorController.addPowers);
router.delete("/warrior/:id/powers", warriorController.removePowers);

export default router;
