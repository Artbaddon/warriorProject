import { connect } from "../config/db/connectMysql.js";

class PowerModel {
  static async create({ name, description, image, damage, cooldown }) {
    try {
      let sqlQuery = `INSERT INTO power (name, description, image, damage, cooldown) VALUES (?, ?, ?, ?, ?)`;
      const [result] = await connect.query(sqlQuery, [name, description, image, damage, cooldown]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM power ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name, description, image, damage, cooldown }) {
    try {
      let sqlQuery = "UPDATE power SET name = ?, description = ?, image = ?, damage = ?, cooldown = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, description, image, damage, cooldown, id]);
      if (result.affectedRows === 0) {
        return { error: "Power not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM power WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Power not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM power WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default PowerModel;
