import { connect } from "../config/db/connectMysql.js";

class WarriorPlayerModel {
  static async create({ warrior_id, player_id }) {
    try {
      // Use INSERT IGNORE to prevent duplicate entries
      let sqlQuery = `INSERT IGNORE INTO warrior_player (warrior_id, player_id) VALUES (?, ?)`;
      const [result] = await connect.query(sqlQuery, [warrior_id, player_id]);
      
      if (result.affectedRows === 0) {
        return { error: "Warrior-Player relationship already exists" };
      }
      
      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async show() {
    try {
      let sqlQuery = `
        SELECT 
          wp.id,
          wp.warrior_id,
          wp.player_id,
          w.name as warrior_name,
          p.name as player_name
        FROM warrior_player wp
        INNER JOIN warrior w ON wp.warrior_id = w.id
        INNER JOIN player p ON wp.player_id = p.id
        ORDER BY wp.id
      `;
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  // Remove update method - pivot tables shouldn't be updated
  // If you need to change a relationship, delete and create new one

  static async delete(id) {
    try {
      let sqlQuery = `DELETE FROM warrior_player WHERE id = ?`;
      const [result] = await connect.query(sqlQuery, [id]);

      if (result.affectedRows === 0) {
        return { error: "Warrior-Player relationship not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async deleteByWarriorAndPlayer(warrior_id, player_id) {
    try {
      let sqlQuery = `DELETE FROM warrior_player WHERE warrior_id = ? AND player_id = ?`;
      const [result] = await connect.query(sqlQuery, [warrior_id, player_id]);

      if (result.affectedRows === 0) {
        return { error: "Warrior-Player relationship not found" };
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      let sqlQuery = `
        SELECT 
          wp.id,
          wp.warrior_id,
          wp.player_id,
          w.name as warrior_name,
          p.name as player_name
        FROM warrior_player wp
        INNER JOIN warrior w ON wp.warrior_id = w.id
        INNER JOIN player p ON wp.player_id = p.id
        WHERE wp.id = ?
      `;
      const [result] = await connect.query(sqlQuery, [id]);
      return result[0];
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findByPlayerId(player_id) {
    try {
      let sqlQuery = `
        SELECT 
          wp.id,
          wp.warrior_id,
          wp.player_id,
          w.name as warrior_name,
          w.description as warrior_description,
          w.image as warrior_image,
          w.level,
          w.health,
          w.energy,
          w.attack,
          w.defense,
          w.speed
        FROM warrior_player wp
        INNER JOIN warrior w ON wp.warrior_id = w.id
        WHERE wp.player_id = ?
        ORDER BY w.level DESC, w.name ASC
      `;
      const [result] = await connect.query(sqlQuery, [player_id]);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findByWarriorId(warrior_id) {
    try {
      let sqlQuery = `
        SELECT 
          wp.id,
          wp.warrior_id,
          wp.player_id,
          p.name as player_name
        FROM warrior_player wp
        INNER JOIN player p ON wp.player_id = p.id
        WHERE wp.warrior_id = ?
        ORDER BY p.name ASC
      `;
      const [result] = await connect.query(sqlQuery, [warrior_id]);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async checkRelationshipExists(warrior_id, player_id) {
    try {
      let sqlQuery = `SELECT id FROM warrior_player WHERE warrior_id = ? AND player_id = ?`;
      const [result] = await connect.query(sqlQuery, [warrior_id, player_id]);
      return result.length > 0;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default WarriorPlayerModel;
