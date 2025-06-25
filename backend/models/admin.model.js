import { connect } from "../config/db/connectMysql.js";

class AdminModel {
  static async create({ username, password }) {
    try {
      let sqlQuery = `INSERT INTO admin (username, password) VALUES (?, ?)`;
      const [result] = await connect.query(sqlQuery, [username, password]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM admin ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { username, password }) {
    try {
      let sqlQuery = "UPDATE admin SET username = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [username, password, id]);
      if (result.affectedRows === 0) {
        return { error: "Admin not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM admin WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Admin not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM admin WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0]; // Return single admin object
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findByUsername(username) {
    try {
      let sqlQuery = `SELECT * FROM admin WHERE username = ?`;
      const [result] = await connect.query(sqlQuery, [username]);
      return result[0]; // Return single admin object
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default AdminModel;
