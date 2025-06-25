import { connect } from "../config/db/connectMysql.js";

class WarriorModel {
  static async getAllWarriors() {
    try {
      const [result] = await connect.query("CALL sp_get_all_warriors_info()");
      return result[0] || [];
    } catch (error) {
      return { error: error.message };
    }
  }

  static async findById(id) {
    try {
      const [result] = await connect.query("CALL sp_get_warrior_info(?)", [id]);
      return result[0][0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async create(warriorData) {
    try {
      const {
        name,
        description,
        image,
        level,
        health,
        energy,
        attack,
        defense,
        speed,
        warrior_type_id,
        race_id,
        magic_id,
      } = warriorData;

      const warriorQuery = `
        INSERT INTO warrior (name, description, image, level, health, energy, attack, defense, speed, warrior_type_id, race_id, magic_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connect.query(warriorQuery, [
        name,
        description,
        image,
        level,
        health,
        energy,
        attack,
        defense,
        speed,
        warrior_type_id,
        race_id,
        magic_id,
      ]);

      return result.insertId;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async update(id, updateData) {
    try {
      const updateFields = [];
      const updateValues = [];

      // Build dynamic update query
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(updateData[key]);
        }
      });

      if (updateFields.length === 0) {
        return { error: "No valid fields to update" };
      }

      updateValues.push(id);
      const updateQuery = `UPDATE warrior SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;
      const [result] = await connect.query(updateQuery, updateValues);

      if (result.affectedRows === 0) {
        return { error: "Warrior not found" };
      }

      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async delete(id) {
    try {
      // First get warrior name for response
      const warrior = await this.findById(id);
      if (!warrior || warrior.error) {
        return { error: "Warrior not found" };
      }

      const [result] = await connect.query("DELETE FROM warrior WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return { error: "Warrior not found" };
      }

      return {
        success: true,
        warrior_name: warrior.warrior_name,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async toggleAvailability(id) {
    try {
      // Get current availability
      const [result] = await connect.query(
        "SELECT is_available, name FROM warrior WHERE id = ?",
        [id]
      );
      if (!result[0]) {
        return { error: "Warrior not found" };
      }

      const warrior = result[0];
      const newAvailability = !warrior.is_available;

      await connect.query("UPDATE warrior SET is_available = ? WHERE id = ?", [
        newAvailability,
        id,
      ]);

      return {
        success: true,
        warrior_name: warrior.name,
        is_available: newAvailability,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async addPowers(warriorId, powerIds) {
    try {
      if (!powerIds || powerIds.length === 0) {
        return { success: true, powers_added: 0 };
      }

      const powerQueries = powerIds.map((powerId) => [warriorId, powerId]);
      const [result] = await connect.query(
        "INSERT IGNORE INTO warrior_power (warrior_id, power_id) VALUES ?",
        [powerQueries]
      );

      return {
        success: true,
        powers_added: result.affectedRows,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async removePowers(warriorId) {
    try {
      const [result] = await connect.query(
        "DELETE FROM warrior_power WHERE warrior_id = ?",
        [warriorId]
      );
      return {
        success: true,
        powers_removed: result.affectedRows,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async validateWarriorType(typeId) {
    try {
      const [result] = await connect.query(
        "SELECT id FROM warrior_type WHERE id = ?",
        [typeId]
      );
      return result[0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async validateRace(raceId) {
    try {
      const [result] = await connect.query("SELECT id FROM race WHERE id = ?", [
        raceId,
      ]);
      return result[0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async validateMagic(magicId) {
    try {
      const [result] = await connect.query(
        "SELECT id FROM magic WHERE id = ?",
        [magicId]
      );
      return result[0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async validatePowers(powerIds) {
    try {
      if (!powerIds || powerIds.length === 0) {
        return { valid: true, power_count: 0 };
      }

      const powerCheckQuery = `SELECT id FROM power WHERE id IN (${powerIds
        .map(() => "?")
        .join(",")})`;
      const [result] = await connect.query(powerCheckQuery, powerIds);

      return {
        valid: result.length === powerIds.length,
        expected: powerIds.length,
        found: result.length,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async checkExists(id) {
    try {
      const [result] = await connect.query(
        "SELECT id FROM warrior WHERE id = ?",
        [id]
      );
      return result[0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async addWarriorToPlayer(warriorId, playerId) {
    try {
      const [result] = await connect.query(
        "INSERT INTO warrior_player (warrior_id, player_id) VALUES (?, ?)",
        [warriorId, playerId]
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async updateWarriorPlayer(warriorId, playerId) {
    try {
      const [result] = await connect.query(
        "UPDATE warrior_player SET player_id = ? WHERE warrior_id = ?",
        [playerId, warriorId]
      );
      if (result.affectedRows === 0) {
        return { error: "Warrior not found for this player" };
      }
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async getPlayerWarrior(playerId) {
    try {
      const [result] = await connect.query(
        "SELECT  * FROM warrior_player WHERE player_id = ?",
        [playerId]
      );
      return result[0] || null;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default WarriorModel;
