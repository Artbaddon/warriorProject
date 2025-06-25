import MagicModel from "../models/magic.model.js";

class MagicController {
  async create(req, res) {
    try {
      const { name, description, image, mana_cost, damage } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
      }

      const magicId = await MagicModel.create({
        name,
        description,
        image,
        mana_cost: mana_cost || 10,
        damage: damage || 0
      });

      res.status(201).json({
        message: "Magic created successfully",
        id: magicId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const magicInfo = await MagicModel.show();

      if (!magicInfo) {
        return res.status(404).json({ error: "No magic found" });
      }
      
      res.status(200).json({
        message: "Magic retrieved successfully",
        data: magicInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description, image, mana_cost, damage } = req.body;

      if (!name || !description || !id) {
        return res.status(400).json({ error: "Name, description, and ID are required" });
      }

      const updateMagicModel = await MagicModel.update(id, {
        name,
        description,
        image,
        mana_cost,
        damage
      });

      if (!updateMagicModel || updateMagicModel.error) {
        return res.status(404).json({
          error: updateMagicModel?.error || "Magic not found",
        });
      }

      res.status(200).json({
        message: "Magic updated successfully",
        id: updateMagicModel,
      });
    } catch (error) {
      console.error("Error updating magic:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deleteMagicModel = await MagicModel.delete(id);

      if (!deleteMagicModel || deleteMagicModel.error) {
        return res.status(404).json({
          error: deleteMagicModel?.error || "Magic not found",
        });
      }

      res.status(200).json({
        message: "Magic deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting magic:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingMagicModel = await MagicModel.findById(id);

      if (!existingMagicModel) {
        return res.status(404).json({ error: "Magic not found" });
      }

      res.status(200).json({
        message: "Magic found successfully",
        data: existingMagicModel,
      });
    } catch (error) {
      console.error("Error finding magic by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new MagicController();
