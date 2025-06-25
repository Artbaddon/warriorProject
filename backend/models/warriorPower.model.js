import { connect } from "../config/db/connectMysql.js";

class WarriorPowerModel {
  static async create({ warrior_id, power_id }) {
    try {
      let sqlQuery = `INSERT INTO warrior_power (warrior_id, power_id) VALUES (?, ?)`;
      const [result] = await connect.query(sqlQuery, [warrior_id, power_id]);
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = "SELECT * FROM warrior_power ORDER BY id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, { warrior_id, power_id }) {
    try {
      let sqlQuery =
        "UPDATE warrior_power SET warrior_id = ?, power_id = ? WHERE id = ?";
      const [result] = await connect.query(sqlQuery, [
        warrior_id,
        power_id,
        id,
      ]);
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
      let sqlQuery = `DELETE FROM warrior_power WHERE id = ?`;
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
      let sqlQuery = `SELECT * FROM warrior_power WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default WarriorPowerModel;
