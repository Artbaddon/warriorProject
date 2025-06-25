import PlayerModel from "../models/player.model.js";
import jwt from "jsonwebtoken";

class PlayerController {
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      let existingPlayer = await PlayerModel.findByName(name);

      let playerId;
      let isNewPlayer = false;

      if (existingPlayer) {
        playerId = existingPlayer.id;
        isNewPlayer = false;
      } else {
        playerId = await PlayerModel.create({ name });
        isNewPlayer = true;
      }

      // Generate JWT token for the player
      const token = jwt.sign(
        {
          id: playerId,
          name: name,
          type: "player", // Distinguish from admin tokens
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Player session lasts 1 hour
        }
      );

      res.status(isNewPlayer ? 201 : 200).json({
        message: isNewPlayer
          ? "Player created successfully"
          : "Player logged in successfully",
        player: {
          id: playerId,
          name: name,
          isNewPlayer: isNewPlayer,
        },
        token: token,
        expiresIn: "1h",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const playerInfo = await PlayerModel.show();

      if (!playerInfo) {
        return res.status(404).json({ error: "No players found" });
      }

      res.status(200).json({
        message: "Players retrieved successfully",
        data: playerInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name } = req.body;

      if (!name || !id) {
        return res.status(400).json({ error: "Name and ID are required" });
      }

      const updatePlayerModel = await PlayerModel.update(id, { name });

      if (!updatePlayerModel || updatePlayerModel.error) {
        return res.status(404).json({
          error: updatePlayerModel?.error || "Player not found",
        });
      }

      res.status(200).json({
        message: "Player updated successfully",
        id: updatePlayerModel,
      });
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deletePlayerModel = await PlayerModel.delete(id);

      if (!deletePlayerModel || deletePlayerModel.error) {
        return res.status(404).json({
          error: deletePlayerModel?.error || "Player not found",
        });
      }

      res.status(200).json({
        message: "Player deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingPlayerModel = await PlayerModel.findById(id);

      if (!existingPlayerModel) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.status(200).json({
        message: "Player found successfully",
        data: existingPlayerModel,
      });
    } catch (error) {
      console.error("Error finding player by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 🎮 PLAYER ACCESS - Get own profile
  async getProfile(req, res) {
    try {
      // req.player comes from verifyPlayerToken middleware
      const playerId = req.player.id;

      const player = await PlayerModel.findById(playerId);

      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.status(200).json({
        message: "Player profile retrieved successfully",
        data: player,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // 🎮 PLAYER ACCESS - Get player's warriors
  async getMyWarriors(req, res) {
    try {
      const playerId = req.player.id; // From JWT token

      const playerWarriors = await PlayerModel.getPlayerWarriors(playerId);

      if (playerWarriors.error) {
        return res.status(500).json({ error: playerWarriors.error });
      }

      if (!playerWarriors || playerWarriors.length === 0) {
        return res.status(200).json({
          message: "No warriors found for this player",
          data: [],
        });
      }

      res.status(200).json({
        message: "Your warriors retrieved successfully",
        data: playerWarriors,
        total: playerWarriors.length,
      });
    } catch (error) {
      console.error("Error getting player warriors:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PlayerController();
