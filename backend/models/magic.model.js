import { connect } from "../config/db/connectMysql.js";

class MagicModel {
  static async create({ name, description, image, mana_cost, damage }) {
    try {
      let sqlQuery = `INSERT INTO magic (name, description, image, mana_cost, damage) VALUES (?, ?, ?, ?, ?)`;
      const [result] = await connect.query(sqlQuery, [name, description, image, mana_cost, damage]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM magic ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name, description, image, mana_cost, damage }) {
    try {
      let sqlQuery = "UPDATE magic SET name = ?, description = ?, image = ?, mana_cost = ?, damage = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, description, image, mana_cost, damage, id]);
      if (result.affectedRows === 0) {
        return { error: "Magic not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM magic WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Magic not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM magic WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default MagicModel;
