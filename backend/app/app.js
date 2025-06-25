import express from "express";
import cors from "cors";

// Middleware imports
import { verifyAdmin } from "../middleware/isAdmin.js";
import { verifyPlayerToken } from "../middleware/playerAuth.js";

// Router imports
import publicRouter from "../routers/public.router.js";
import playerRouter from "../routers/player.router.js";
import warriorRouter from "../routers/warrior.router.js";
import gameRouter from "../routers/game.router.js";
import raceRouter from "../routers/race.router.js";
import warriorTypeRouter from "../routers/warriorType.router.js";
import magicRouter from "../routers/magic.router.js";
import powerRouter from "../routers/power.router.js";
import adminRouter from "../routers/admin.router.js";

// Controller imports for direct routes
import adminController from "../controllers/admin.controller.js";
import playerController from "../controllers/player.controller.js";

const app = express();
const api = "/api_v1";

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public authentication routes (no middleware)
app.post(api + "/admin/login", adminController.login);
app.post(api + "/player/login", playerController.create);

// Public GET routes (no authentication required)
app.use(api, publicRouter);

// Mixed routers (handle their own auth internally)
app.use(api, playerRouter);
app.use(api, gameRouter);

// Admin-only routers (all routes require admin auth)
app.use(api, verifyAdmin, raceRouter);
app.use(api, verifyAdmin, warriorRouter);
app.use(api, verifyAdmin, warriorTypeRouter);
app.use(api, verifyAdmin, magicRouter);
app.use(api, verifyAdmin, powerRouter);
app.use(api, verifyAdmin, adminRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

export default app;
