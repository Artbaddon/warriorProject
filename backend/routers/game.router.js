import { Router } from "express";
import gameController from "../controllers/game.controller.js";
import { verifyPlayerToken } from "../middleware/playerAuth.js";
import { verifyAdmin } from "../middleware/isAdmin.js";

const router = Router();

// 🌐 PUBLIC ROUTES
router.get("/games/:gameCode/status", gameController.getGameStatus);
router.get("/games/:gameCode/simulate", gameController.simulateBattle);

// 🎮 PLAYER ROUTES
router.post("/games/join", verifyPlayerToken, gameController.joinGame);
router.post("/games/end", verifyPlayerToken, gameController.endGame);
router.get("/player/games", verifyPlayerToken, gameController.getPlayerGames);
router.get("/player/power", verifyPlayerToken, gameController.getMyPower);

// 🔐 ADMIN ROUTES
router.post("/games", verifyAdmin, gameController.create);
router.get("/games", verifyAdmin, gameController.getAllGames);
router.post("/admin/games/end", verifyAdmin, gameController.endGame);

export default router;
