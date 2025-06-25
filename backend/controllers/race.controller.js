import RaceModel from "../models/race.model.js";

class RaceController {
  async create(req, res) {
    try {
      const { name, description, image } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
      }

      const raceId = await RaceModel.create({
        name,
        description,
        image
      });

      res.status(201).json({
        message: "Race created successfully",
        id: raceId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const raceInfo = await RaceModel.show();

      if (!raceInfo) {
        return res.status(404).json({ error: "No races found" });
      }
      
      res.status(200).json({
        message: "Races retrieved successfully",
        data: raceInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description, image } = req.body;

      if (!name || !description || !id) {
        return res.status(400).json({ error: "Name, description, and ID are required" });
      }

      const updateRaceModel = await RaceModel.update(id, {
        name,
        description,
        image
      });

      if (!updateRaceModel || updateRaceModel.error) {
        return res.status(404).json({
          error: updateRaceModel?.error || "Race not found",
        });
      }

      res.status(200).json({
        message: "Race updated successfully",
        id: updateRaceModel,
      });
    } catch (error) {
      console.error("Error updating race:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deleteRaceModel = await RaceModel.delete(id);

      if (!deleteRaceModel || deleteRaceModel.error) {
        return res.status(404).json({
          error: deleteRaceModel?.error || "Race not found",
        });
      }

      res.status(200).json({
        message: "Race deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting race:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingRaceModel = await RaceModel.findById(id);

      if (!existingRaceModel) {
        return res.status(404).json({ error: "Race not found" });
      }

      res.status(200).json({
        message: "Race found successfully",
        data: existingRaceModel,
      });
    } catch (error) {
      console.error("Error finding race by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RaceController();
