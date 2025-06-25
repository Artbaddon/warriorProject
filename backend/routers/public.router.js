import { Router } from "express";
import raceController from "../controllers/race.controller.js";
import warriorController from "../controllers/warrior.controller.js";
import warriorTypeController from "../controllers/warriorType.controller.js";
import magicController from "../controllers/magic.controller.js";
import powerController from "../controllers/power.controller.js";

const router = Router();

// Public GET routes - no authentication required
router.get("/races", raceController.show);

router.get("/warriors", warriorController.show);
router.get("/warrior-types", warriorTypeController.show);
router.get("/magic", magicController.show);
router.get("/power/:id", powerController.findById);
router.get("/powers", powerController.show);
router.get("/powers/:id", powerController.findById);

export default router;
