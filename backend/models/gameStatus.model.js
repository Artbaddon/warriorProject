import { connect } from "../config/db/connectMysql.js";

class GameStatusModel {
  static async create({ name, description }) {
    try {
      let sqlQuery = `INSERT INTO game_status (name, description) VALUES (?, ?)`;
      const [result] = await connect.query(sqlQuery, [name, description]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM game_status ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name, description }) {
    try {
      let sqlQuery =
        "UPDATE game_status SET name = ?, description = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, description, id]);
      if (result.affectedRows === 0) {
        return { error: "game_status not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM game_status WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "game_status not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM game_status WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0]; // Return single game_status object
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default GameStatusModel;
