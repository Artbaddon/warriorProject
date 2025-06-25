import WarriorModel from "../models/warrior.model.js";

class WarriorController {
  // Create new warrior (admin only)
  async create(req, res) {
    try {
      const {
        name,
        description,
        image,
        level,
        health,
        energy,
        attack,
        defense,
        speed,
        warrior_type_id,
        race_id,
        magic_id,
        power_ids,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !description ||
        !level ||
        !health ||
        !energy ||
        !attack ||
        !defense ||
        !speed ||
        !warrior_type_id ||
        !race_id
      ) {
        return res.status(400).json({
          error:
            "Name, description, level, health, energy, attack, defense, speed, warrior_type_id, and race_id are required",
        });
      }

      // Validate warrior type
      const validType = await WarriorModel.validateWarriorType(warrior_type_id);
      if (!validType || validType.error) {
        return res.status(400).json({ error: "Invalid warrior type ID" });
      }

      // Validate race
      const validRace = await WarriorModel.validateRace(race_id);
      if (!validRace || validRace.error) {
        return res.status(400).json({ error: "Invalid race ID" });
      }

      // Validate magic if provided
      if (magic_id) {
        const validMagic = await WarriorModel.validateMagic(magic_id);
        if (!validMagic || validMagic.error) {
          return res.status(400).json({ error: "Invalid magic ID" });
        }
      }

      // Validate powers if provided
      if (power_ids && power_ids.length > 0) {
        const validPowers = await WarriorModel.validatePowers(power_ids);
        if (!validPowers.valid || validPowers.error) {
          return res.status(400).json({ error: "Invalid power IDs provided" });
        }
      }

      // Create warrior
      const warriorId = await WarriorModel.create({
        name,
        description,
        image,
        level,
        health,
        energy,
        attack,
        defense,
        speed,
        warrior_type_id,
        race_id,
        magic_id,
      });

      if (warriorId.error) {
        return res.status(500).json({ error: warriorId.error });
      }

      // Add powers if provided
      if (power_ids && power_ids.length > 0) {
        await WarriorModel.addPowers(warriorId, power_ids);
      }

      res.status(201).json({
        message: "Warrior created successfully",
        id: warriorId,
      });
    } catch (error) {
      console.error("Error creating warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all warriors (public)
  async show(req, res) {
    try {
      const warriors = await WarriorModel.getAllWarriors();

      if (warriors.error) {
        return res.status(500).json({ error: warriors.error });
      }

      res.status(200).json({
        message: "Warriors retrieved successfully",
        data: warriors,
      });
    } catch (error) {
      console.error("Error getting all warriors:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get warrior by ID (public)
  async findById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      const warrior = await WarriorModel.findById(id);

      if (!warrior) {
        return res.status(404).json({ error: "Warrior not found" });
      }

      if (warrior.error) {
        return res.status(500).json({ error: warrior.error });
      }

      res.status(200).json({
        message: "Warrior found successfully",
        data: warrior,
      });
    } catch (error) {
      console.error("Error getting warrior by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Update warrior (admin only)
  async update(req, res) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      // Check if warrior exists
      const existingWarrior = await WarriorModel.checkExists(id);
      if (!existingWarrior) {
        return res.status(404).json({ error: "Warrior not found" });
      }

      // Validate warrior type if provided
      if (updateData.warrior_type_id) {
        const validType = await WarriorModel.validateWarriorType(
          updateData.warrior_type_id
        );
        if (!validType || validType.error) {
          return res.status(400).json({ error: "Invalid warrior type ID" });
        }
      }

      // Validate race if provided
      if (updateData.race_id) {
        const validRace = await WarriorModel.validateRace(updateData.race_id);
        if (!validRace || validRace.error) {
          return res.status(400).json({ error: "Invalid race ID" });
        }
      }

      // Validate magic if provided
      if (updateData.magic_id) {
        const validMagic = await WarriorModel.validateMagic(
          updateData.magic_id
        );
        if (!validMagic || validMagic.error) {
          return res.status(400).json({ error: "Invalid magic ID" });
        }
      }

      // Remove power_ids from update data as it's handled separately
      const { power_ids, ...warriorUpdateData } = updateData;

      const updateResult = await WarriorModel.update(id, warriorUpdateData);

      if (updateResult.error) {
        return res.status(404).json({ error: updateResult.error });
      }

      // Handle powers if provided
      if (power_ids !== undefined) {
        // Remove existing powers
        await WarriorModel.removePowers(id);

        // Add new powers if any
        if (power_ids && power_ids.length > 0) {
          const validPowers = await WarriorModel.validatePowers(power_ids);
          if (!validPowers.valid || validPowers.error) {
            return res
              .status(400)
              .json({ error: "Invalid power IDs provided" });
          }
          await WarriorModel.addPowers(id, power_ids);
        }
      }

      res.status(200).json({
        message: "Warrior updated successfully",
        id: id,
      });
    } catch (error) {
      console.error("Error updating warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Delete warrior (admin only)
  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      const deleteResult = await WarriorModel.delete(id);

      if (deleteResult.error) {
        return res.status(404).json({ error: deleteResult.error });
      }

      res.status(200).json({
        message: "Warrior deleted successfully",
        warrior_name: deleteResult.warrior_name,
      });
    } catch (error) {
      console.error("Error deleting warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Toggle warrior availability (admin only)
  async toggleAvailability(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      const toggleResult = await WarriorModel.toggleAvailability(id);

      if (toggleResult.error) {
        return res.status(404).json({ error: toggleResult.error });
      }

      res.status(200).json({
        message: `Warrior availability toggled successfully`,
        warrior_name: toggleResult.warrior_name,
        is_available: toggleResult.is_available,
      });
    } catch (error) {
      console.error("Error toggling warrior availability:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Add powers to warrior (admin only)
  async addPowers(req, res) {
    try {
      const { id } = req.params;
      const { power_ids } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      if (!power_ids || !Array.isArray(power_ids) || power_ids.length === 0) {
        return res.status(400).json({ error: "Power IDs array is required" });
      }

      // Check if warrior exists
      const existingWarrior = await WarriorModel.checkExists(id);
      if (!existingWarrior) {
        return res.status(404).json({ error: "Warrior not found" });
      }

      // Validate powers
      const validPowers = await WarriorModel.validatePowers(power_ids);
      if (!validPowers.valid || validPowers.error) {
        return res.status(400).json({ error: "Invalid power IDs provided" });
      }

      const result = await WarriorModel.addPowers(id, power_ids);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      res.status(200).json({
        message: "Powers added to warrior successfully",
        powers_added: result.powers_added,
      });
    } catch (error) {
      console.error("Error adding powers to warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Remove all powers from warrior (admin only)
  async removePowers(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Warrior ID is required" });
      }

      // Check if warrior exists
      const existingWarrior = await WarriorModel.checkExists(id);
      if (!existingWarrior) {
        return res.status(404).json({ error: "Warrior not found" });
      }

      const result = await WarriorModel.removePowers(id);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      res.status(200).json({
        message: "Powers removed from warrior successfully",
        powers_removed: result.powers_removed,
      });
    } catch (error) {
      console.error("Error removing powers from warrior:", error);
      res.status(500).json({ error: error.message });
    }
  }
  async addWarriorToPlayer(req, res) {
    try {
      const { warrior_id, player_id } = req.body;

      if (!warrior_id || !player_id) {
        return res
          .status(400)
          .json({ error: "Warrior ID and Player ID are required" });
      }

      // Check if warrior exists
      const existingWarrior = await WarriorModel.checkExists(warrior_id);
      if (!existingWarrior) {
        return res.status(404).json({ error: "Warrior not found" });
      }

      // Check if player exists
      const existingPlayer = await WarriorModel.checkPlayerExists(player_id);
      if (!existingPlayer) {
        return res.status(404).json({ error: "Player not found" });
      }
      //Check if player has already 1 warrior
      const playerWarriorCount = await WarriorModel.getPlayerWarrior(player_id);

      if (playerWarriorCount && playerWarriorCount.length >= 1) {
        const result = await WarriorModel.updateWarriorToPlayer(
          warrior_id,
          player_id
        );
        if (result.error) {
          return res.status(500).json({ error: result.error });
        }
        return res.status(200).json({
          message: "Warrior updated to player successfully",
          data: result,
        });
      }
      const result = await WarriorModel.addWarriorToPlayer(
        warrior_id,
        player_id
      );

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      res.status(200).json({
        message: "Warrior added to player successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error adding warrior to player:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new WarriorController();
