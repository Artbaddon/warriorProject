import { Router } from "express";
import magicController from "../controllers/magic.controller.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/magic", magicController.create);
router.get("/magic/:id", magicController.findById);
router.put("/magic/:id", magicController.update);
router.delete("/magic/:id", magicController.delete);


export default router;
