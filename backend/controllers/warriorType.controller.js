import WarriorTypeModel from "../models/warriorType.model.js";

class WarriorTypeController {
  async create(req, res) {
    try {
      const { name, description } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
      }

      const warriorTypeId = await WarriorTypeModel.create({
        name,
        description,
        image
      });

      res.status(201).json({
        message: "Warrior type created successfully",
        id: warriorTypeId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const warriorTypeInfo = await WarriorTypeModel.show();

      if (!warriorTypeInfo) {
        return res.status(404).json({ error: "No warrior types found" });
      }
      
      res.status(200).json({
        message: "Warrior types retrieved successfully",
        data: warriorTypeInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description } = req.body;
      const image = req.file ? req.file.filename : req.body.image;

      if (!name || !description || !id) {
        return res.status(400).json({ error: "Name, description, and ID are required" });
      }

      const updateWarriorTypeModel = await WarriorTypeModel.update(id, {
        name,
        description,
        image
      });

      if (!updateWarriorTypeModel || updateWarriorTypeModel.error) {
        return res.status(404).json({
          error: updateWarriorTypeModel?.error || "Warrior type not found",
        });
      }

      res.status(200).json({
        message: "Warrior type updated successfully",
        id: updateWarriorTypeModel,
      });
    } catch (error) {
      console.error("Error updating warrior type:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const deleteWarriorTypeModel = await WarriorTypeModel.delete(id);

      if (!deleteWarriorTypeModel || deleteWarriorTypeModel.error) {
        return res.status(404).json({
          error: deleteWarriorTypeModel?.error || "Warrior type not found",
        });
      }

      res.status(200).json({
        message: "Warrior type deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting warrior type:", error);
      res.status(500).json({ error: error.message });
    }  }

  async uploadImage(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: "Warrior Type ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Check if warrior type exists
      const existingWarriorType = await WarriorTypeModel.findById(id);
      if (!existingWarriorType) {
        return res.status(404).json({ error: "Warrior type not found" });
      }

      const image = req.file.filename;
      const updateResult = await WarriorTypeModel.update(id, { 
        name: existingWarriorType.Warrior_type_name,
        description: existingWarriorType.Warrior_type_description, 
        image 
      });

      if (!updateResult || updateResult.error) {
        return res.status(500).json({
          error: updateResult?.error || "Failed to update warrior type image",
        });
      }

      res.status(200).json({
        message: "Warrior type image uploaded successfully",
        image: image,
        imageUrl: `/uploads/warriorTypes/${image}`
      });
    } catch (error) {
      console.error("Error uploading warrior type image:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingWarriorTypeModel = await WarriorTypeModel.findById(id);

      if (!existingWarriorTypeModel) {
        return res.status(404).json({ error: "Warrior type not found" });
      }

      res.status(200).json({
        message: "Warrior type found successfully",
        data: existingWarriorTypeModel,
      });
    } catch (error) {
      console.error("Error finding warrior type by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new WarriorTypeController();
