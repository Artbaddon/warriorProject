import AdminModel from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { encryptPassword, comparePassword } from "../library/appBcrypt.js";

class AdminController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      // Find Admin by username
      const Admin = await AdminModel.findByUsername(username);
      if (!Admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, Admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: Admin.id,
          username: Admin.username,
          role: "Admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        Admin: {
          id: Admin.id,
          username: Admin.username,
          token,
          created_at: Admin.created_at,
          updated_at: Admin.updated_at,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Register - Updated to match schema
  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const hashedPassword = await encryptPassword(password);

      const AdminId = await AdminModel.create({
        username,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "Admin created successfully",
        id: AdminId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const AdminsInfo = await AdminModel.show();

      if (!AdminsInfo) {
        return res.status(409).json({ error: "No Admins found" });
      }
      res.status(200).json({
        message: "Admins retrieved successfully",
        data: AdminsInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, password } = req.body;

      if (!name || !password || !id) {
        return res
          .status(409)
          .json({ error: "Name, description, and ID are required" });
      }

      const updateAdminModel = await AdminModel.update(id, {
        name,
        password,
      });

      if (!updateAdminModel || updateAdminModel.error) {
        return res.status(409).json({
          error: updateAdminModel?.error || "Admin not found",
        });
      }

      res.status(201).json({
        message: "Admin updated successfully",
        id: updateAdminModel,
      });
    } catch (error) {
      console.error("Error updating Admin:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      console.log("Deleting Admin with ID:", id);

      const deleteAdminModel = await AdminModel.delete(id);
      console.log("Delete result:", deleteAdminModel);

      if (!deleteAdminModel || deleteAdminModel.error) {
        return res.status(404).json({
          error: deleteAdminModel?.error || "Admin not found",
        });
      }

      res.status(200).json({
        message: "Admin deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting Admin:", error);
      res.status(500).json({ error: error.message });
    }
  }
  async findById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const existingAdminModel = await AdminModel.findById(id);

      if (!existingAdminModel) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.status(200).json({
        message: "Admin found successfully",
        data: existingAdminModel,
      });
    } catch (error) {
      console.error("Error finding Admin by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AdminController();
