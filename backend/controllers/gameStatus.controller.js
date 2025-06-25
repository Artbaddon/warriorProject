import GameStatusModel from "../models/gameStatus.model.js";

class GameStatusController {
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "name and description are required" });
      }

      const GameStatusId = await GameStatusModel.create({
        name,
        description,
      });

      res.status(201).json({
        message: "GameStatus created successfully",
        id: GameStatusId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const GameStatusInfo = await GameStatusModel.show();

      if (!GameStatusInfo) {
        return res.status(409).json({ error: "No GameStatus found" });
      }
      res.status(200).json({
        message: "GameStatus retrieved successfully",
        data: GameStatusInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description } = req.body;

      if (!name || !description || !description || !id) {
        return res
          .status(409)
          .json({ error: "Name, description, and ID are required" });
      }

      const updateGameStatusModel = await GameStatusModel.update(id, {
        name,
        description,
      });

      if (!updateGameStatusModel || updateGameStatusModel.error) {
        return res.status(409).json({
          error: updateGameStatusModel?.error || "GameStatus not found",
        });
      }

      res.status(201).json({
        message: "GameStatus updated successfully",
        id: updateGameStatusModel,
      });
    } catch (error) {
      console.error("Error updating GameStatus:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      console.log("Deleting GameStatus with ID:", id);

      const deleteGameStatusModel = await GameStatusModel.delete(id);
      console.log("Delete result:", deleteGameStatusModel);

      if (!deleteGameStatusModel || deleteGameStatusModel.error) {
        return res.status(404).json({
          error: deleteGameStatusModel?.error || "GameStatus not found",
        });
      }

      res.status(200).json({
        message: "GameStatus deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting GameStatus:", error);
      res.status(500).json({ error: error.message });
    }
  }
  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingGameStatusModel = await GameStatusModel.findById(id);

      if (!existingGameStatusModel) {
        return res.status(404).json({ error: "GameStatus not found" });
      }

      res.status(200).json({
        message: "GameStatus found successfully",
        data: existingGameStatusModel,
      });
    } catch (error) {
      console.error("Error finding GameStatus by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GameStatusController();
