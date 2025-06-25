import { Router } from "express";
import powerController from "../controllers/power.controller.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/power", powerController.create);
router.put("/power/:id", powerController.update);
router.delete("/power/:id", powerController.delete);


export default router;
