import WarriorPlayerModel from "../models/warriorPlayer.model.js";

class WarriorPlayerController {
  // 🎮 PLAYER ACTION: Acquire/Claim a warrior
  async create(req, res) {
    try {
      const { warrior_id, player_id } = req.body;

      if (!warrior_id || !player_id) {
        return res
          .status(400)
          .json({ error: "warrior_id and player_id are required" });
      }

      // Check if relationship already exists
      const exists = await WarriorPlayerModel.checkRelationshipExists(warrior_id, player_id);
      if (exists) {
        return res.status(400).json({ 
          error: "Player already owns this warrior" 
        });
      }

      const relationshipId = await WarriorPlayerModel.create({
        warrior_id,
        player_id,
      });

      if (relationshipId.error) {
        return res.status(400).json({ error: relationshipId.error });
      }

      res.status(201).json({
        message: "Warrior acquired successfully",
        id: relationshipId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔐 ADMIN ONLY: View all warrior-player relationships
  async show(req, res) {
    try {
      const relationships = await WarriorPlayerModel.show();

      if (!relationships || relationships.error) {
        return res.status(404).json({ 
          error: relationships?.error || "No warrior-player relationships found" 
        });
      }

      res.status(200).json({
        message: "Warrior-player relationships retrieved successfully",
        data: relationships,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🎮 PLAYER ACTION: Release/Remove warrior from player
  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deleteResult = await WarriorPlayerModel.delete(id);

      if (!deleteResult || deleteResult.error) {
        return res.status(404).json({
          error: deleteResult?.error || "Warrior-player relationship not found",
        });
      }

      res.status(200).json({
        message: "Warrior released successfully",
        id,
      });
    } catch (error) {
      console.error("Error releasing warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 🎮 PLAYER ACTION: Release warrior by warrior and player IDs
  async releaseWarrior(req, res) {
    try {
      const { warrior_id, player_id } = req.body;

      if (!warrior_id || !player_id) {
        return res.status(400).json({ 
          error: "warrior_id and player_id are required" 
        });
      }

      const deleteResult = await WarriorPlayerModel.deleteByWarriorAndPlayer(
        warrior_id, 
        player_id
      );

      if (!deleteResult || deleteResult.error) {
        return res.status(404).json({
          error: deleteResult?.error || "Warrior-player relationship not found",
        });
      }

      res.status(200).json({
        message: "Warrior released successfully"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🌐 PUBLIC: Find relationship by ID
  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const relationship = await WarriorPlayerModel.findById(id);

      if (!relationship) {
        return res.status(404).json({ error: "Warrior-player relationship not found" });
      }

      res.status(200).json({
        message: "Warrior-player relationship found successfully",
        data: relationship,
      });
    } catch (error) {
      console.error("Error finding warrior-player relationship by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 🎮 PLAYER ACCESS: Get player's warriors
  async getPlayerWarriors(req, res) {
    try {
      const playerId = req.params.player_id;

      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }

      const playerWarriors = await WarriorPlayerModel.findByPlayerId(playerId);

      if (!playerWarriors || playerWarriors.error) {
        return res.status(404).json({ 
          error: playerWarriors?.error || "No warriors found for this player" 
        });
      }

      res.status(200).json({
        message: "Player warriors retrieved successfully",
        data: playerWarriors,
      });
    } catch (error) {
      console.error("Error finding warriors by Player ID:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 🔐 ADMIN ONLY: Get warrior owners
  async getWarriorOwners(req, res) {
    try {
      const warriorId = req.params.warrior_id;

      if (!warriorId) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      const warriorOwners = await WarriorPlayerModel.findByWarriorId(warriorId);

      if (!warriorOwners || warriorOwners.error) {
        return res.status(404).json({ 
          error: warriorOwners?.error || "No owners found for this warrior" 
        });
      }

      res.status(200).json({
        message: "Warrior owners retrieved successfully",
        data: warriorOwners,
      });
    } catch (error) {
      console.error("Error finding owners by Warrior ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new WarriorPlayerController();
