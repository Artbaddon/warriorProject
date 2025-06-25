import { connect } from "../config/db/connectMysql.js";

class WarriorTypeModel {
  static async create({ name, description, image }) {
    try {
      let sqlQuery = `INSERT INTO warrior_type (name, description, image) VALUES (?, ?, ?)`;
      const [result] = await connect.query(sqlQuery, [name, description, image]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM warrior_type ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name, description, image }) {
    try {
      let sqlQuery = "UPDATE warrior_type SET name = ?, description = ?, image = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, description, image, id]);
      if (result.affectedRows === 0) {
        return { error: "Warrior type not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM warrior_type WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Warrior type not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM warrior_type WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default WarriorTypeModel;
