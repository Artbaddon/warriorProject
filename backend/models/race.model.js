import { connect } from "../config/db/connectMysql.js";

class RaceModel {
  static async create({ name, description, image }) {
    try {
      let sqlQuery = `INSERT INTO race (name, description, image) VALUES (?, ?, ?)`;
      const [result] = await connect.query(sqlQuery, [name, description, image]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM race ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name, description, image }) {
    try {
      let sqlQuery = "UPDATE race SET name = ?, description = ?, image = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, description, image, id]);
      if (result.affectedRows === 0) {
        return { error: "Race not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM race WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Race not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM race WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default RaceModel;
