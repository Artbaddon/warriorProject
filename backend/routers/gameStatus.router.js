import { Router } from "express";
import gameStatus from "../controllers/gameStatus.controller.js";

const router = Router();

// Admin routes (require specific permissions)
router.post("/gameStatus", gameStatus.create);
router.get("/gameStatus/:id", gameStatus.findById);
router.get("/gameStatus/all", gameStatus.show);
router.put("/gameStatus/:id", gameStatus.update);
router.delete("/gameStatus/:id", gameStatus.delete);

export default router;
