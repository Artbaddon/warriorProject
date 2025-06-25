import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const router = Router();

// Admin routes (require specific permissions)
router.get("/admin", adminController.show);
router.post("/admin", adminController.register);
router.get("/admin/:id", adminController.findById);
router.put("/admin/:id", adminController.update);
router.delete("/admin/:id", adminController.delete);

export default router;
