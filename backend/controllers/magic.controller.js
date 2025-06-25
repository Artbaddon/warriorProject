import MagicModel from "../models/magic.model.js";

class MagicController {
  async create(req, res) {
    try {
      const { name, description, mana_cost, damage } = req.body;
      const image = req.file ? req.file.filename : null;

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
      const { name, description, mana_cost, damage } = req.body;
      const image = req.file ? req.file.filename : req.body.image;

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
      res.status(500).json({ error: error.message });    }
  }

  async uploadImage(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: "Magic ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Check if magic exists
      const existingMagic = await MagicModel.findById(id);
      if (!existingMagic) {
        return res.status(404).json({ error: "Magic not found" });
      }

      const image = req.file.filename;
      const updateResult = await MagicModel.update(id, { 
        name: existingMagic.Magic_name,
        description: existingMagic.Magic_description, 
        image,
        mana_cost: existingMagic.Magic_mana_cost,
        damage: existingMagic.Magic_damage
      });

      if (!updateResult || updateResult.error) {
        return res.status(500).json({
          error: updateResult?.error || "Failed to update magic image",
        });
      }

      res.status(200).json({
        message: "Magic image uploaded successfully",
        image: image,
        imageUrl: `/uploads/magic/${image}`
      });
    } catch (error) {
      console.error("Error uploading magic image:", error);
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
