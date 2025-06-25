import { Router } from "express";
import playerController from "../controllers/player.controller.js";

const router = Router();

// 🌐 PUBLIC ROUTES - No authentication needed
router.post("/player/login", playerController.create);

// 🎮 PLAYER ROUTES - Will require player authentication in app.js
router.get("/player/profile", playerController.getProfile);
router.get("/player/warriors", playerController.getMyWarriors);

// 🔐 ADMIN ROUTES - Will require admin authentication in app.js  
router.get("/players", playerController.show);
router.get("/player/:id", playerController.findById);
router.put("/player/:id", playerController.update);
router.delete("/player/:id", playerController.delete);

export default router;
