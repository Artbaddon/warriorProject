import { connect } from "../config/db/connectMysql.js";

class PlayerModel {
  static async create({ name }) {
    try {
      let sqlQuery = `INSERT INTO player (name) VALUES (?)`;
      const [result] = await connect.query(sqlQuery, [name]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM player ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { name }) {
    try {
      let sqlQuery = "UPDATE player SET name = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [name, id]);
      if (result.affectedRows === 0) {
        return { error: "Player not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM player WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Player not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `SELECT * FROM player WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findByName(name) {
    try {
      let sqlQuery = `SELECT * FROM player WHERE name = ?`;
      const [result] = await connect.query(sqlQuery, [name]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }

  static async getPlayerWarriors(playerId) {
    try {
      const [result] = await connect.query('CALL sp_get_player_warriors(?)', [playerId]);
      return result[0] || [];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default PlayerModel;
