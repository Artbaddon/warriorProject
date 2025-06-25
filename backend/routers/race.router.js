import { Router } from "express";
import raceController from "../controllers/race.controller.js";

const router = Router();

// Admin routes (require admin permissions)
router.post("/race", raceController.create);
router.get("/race/:id", raceController.findById);
router.put("/race/:id", raceController.update);
router.delete("/race/:id", raceController.delete);

export default router;
