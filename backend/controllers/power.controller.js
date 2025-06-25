import PowerModel from "../models/power.model.js";

class PowerController {
  async create(req, res) {
    try {
      const { name, description, damage, cooldown } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!name || !description || !damage) {
        return res.status(400).json({ error: "Name, description, and damage are required" });
      }

      const powerId = await PowerModel.create({
        name,
        description,
        image,
        damage,
        cooldown: cooldown || 0
      });

      res.status(201).json({
        message: "Power created successfully",
        id: powerId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const powerInfo = await PowerModel.show();

      if (!powerInfo) {
        return res.status(404).json({ error: "No powers found" });
      }
      
      res.status(200).json({
        message: "Powers retrieved successfully",
        data: powerInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description, damage, cooldown } = req.body;
      const image = req.file ? req.file.filename : req.body.image;

      if (!name || !description || !damage || !id) {
        return res.status(400).json({ error: "Name, description, damage, and ID are required" });
      }

      const updatePowerModel = await PowerModel.update(id, {
        name,
        description,
        image,
        damage,
        cooldown
      });

      if (!updatePowerModel || updatePowerModel.error) {
        return res.status(404).json({
          error: updatePowerModel?.error || "Power not found",
        });
      }

      res.status(200).json({
        message: "Power updated successfully",
        id: updatePowerModel,
      });
    } catch (error) {
      console.error("Error updating power:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deletePowerModel = await PowerModel.delete(id);

      if (!deletePowerModel || deletePowerModel.error) {
        return res.status(404).json({
          error: deletePowerModel?.error || "Power not found",
        });
      }

      res.status(200).json({
        message: "Power deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting power:", error);
      res.status(500).json({ error: error.message });    }
  }

  async uploadImage(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: "Power ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Check if power exists
      const existingPower = await PowerModel.findById(id);
      if (!existingPower) {
        return res.status(404).json({ error: "Power not found" });
      }

      const image = req.file.filename;
      const updateResult = await PowerModel.update(id, { 
        name: existingPower.Power_name,
        description: existingPower.Power_description, 
        image,
        damage: existingPower.Power_damage,
        cooldown: existingPower.Power_cooldown
      });

      if (!updateResult || updateResult.error) {
        return res.status(500).json({
          error: updateResult?.error || "Failed to update power image",
        });
      }

      res.status(200).json({
        message: "Power image uploaded successfully",
        image: image,
        imageUrl: `/uploads/powers/${image}`
      });
    } catch (error) {
      console.error("Error uploading power image:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingPowerModel = await PowerModel.findById(id);

      if (!existingPowerModel) {
        return res.status(404).json({ error: "Power not found" });
      }

      res.status(200).json({
        message: "Power found successfully",
        data: existingPowerModel,
      });
    } catch (error) {
      console.error("Error finding power by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PowerController();
