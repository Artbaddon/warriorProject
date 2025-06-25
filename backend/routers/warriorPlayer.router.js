import { Router } from "express";
import WarriorPlayerController from "../controllers/warriorPlayer.controller.js";

const router = Router();

// 🌐 PUBLIC ROUTES
router.get("/warrior-player/:id", WarriorPlayerController.findById);

// 🎮 PLAYER ROUTES (should have player auth when implemented)
router.post("/warrior-player/acquire", WarriorPlayerController.create);
router.delete("/warrior-player/release", WarriorPlayerController.releaseWarrior);
router.get("/player/:player_id/warriors", WarriorPlayerController.getPlayerWarriors);

// 🔐 ADMIN ROUTES (require admin permissions)
router.get("/warrior-player/all", WarriorPlayerController.show);
router.delete("/warrior-player/:id", WarriorPlayerController.delete);
router.get("/warrior/:warrior_id/owners", WarriorPlayerController.getWarriorOwners);

export default router;
