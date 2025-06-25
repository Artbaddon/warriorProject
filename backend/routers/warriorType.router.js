import { Router } from "express";
import warriorTypeController from "../controllers/warriorType.controller.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/warrior-type", warriorTypeController.create);
router.get("/warrior-type/:id", warriorTypeController.findById);
router.put("/warrior-type/:id", warriorTypeController.update);
router.delete("/warrior-type/:id", warriorTypeController.delete);

export default router;
