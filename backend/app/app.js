import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    return res.status(500).json({ error: err.message });
  } else if (err) {
    // Handle other errors
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
  next();
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

export default app;
