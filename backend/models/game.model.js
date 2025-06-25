import { connect } from "../config/db/connectMysql.js";

class GameModel {
  // Create a new game
  static async create(gameData) {
    try {
      const { gameCode, expirationMinutes = 30 } = gameData;

      // Calculate expiration time
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + expirationMinutes);
      const [result] = await connect.query(
        `INSERT INTO game (code, expiration, status_id) 
         VALUES (?, ?, 1)`, // 1 = 'waiting' status
        [gameCode, expiration]
      );

      return {
        gameId: result.insertId,
        gameCode,
        expiration,
        status: "waiting",
      };
    } catch (error) {
      console.error("Error creating game:", error);
      return { error: error.message };
    }
  }

  // Find game by code
  static async findByCode(gameCode) {
    try {
      const [rows] = await connect.query(
        `SELECT g.*, gs.name as status
         FROM game g
         JOIN game_status gs ON g.status_id = gs.id
         WHERE g.code = ?`,
        [gameCode]
      );

      if (rows.length === 0) return null;

      const game = rows[0];

      // Get players in this game
      const [players] = await connect.query(
        `SELECT pg.*, p.name as player_name
         FROM player_game pg
         JOIN player p ON pg.player_id = p.id
         WHERE pg.game_id = ?`,
        [game.id]
      );

      return {
        ...game,
        players: players,
      };
    } catch (error) {
      console.error("Error finding game:", error);
      return { error: error.message };
    }
  }

  // Join a game
  static async joinGame(gameCode, playerId) {
    try {
      const game = await this.findByCode(gameCode);

      if (!game) {
        return { error: "Game not found" };
      }

      if (game.players.length >= 2) {
        return { error: "Game is full (max 2 players)" };
      }
      // Check if player already in game
      const playerInGame = game.players.find((p) => p.player_id === playerId);
      if (playerInGame) {
        return { error: "Player already in this game" };
      }

      // Add player to game
      await connect.query(
        `INSERT INTO player_game (game_id, player_id) VALUES (?, ?)`,
        [game.id, playerId]
      );

      // If this is the second player, start the game
      if (game.players.length === 1) {
        await connect.query(
          `UPDATE game SET status_id = 2 WHERE id = ?`, // 2 = 'active'
          [game.id]
        );

        return {
          success: true,
          message: "Game started! Both players joined.",
          game_status: "active",
        };
      }

      return {
        success: true,
        message: "Joined game successfully. Waiting for second player.",
        game_status: "waiting",
      };
    } catch (error) {
      console.error("Error joining game:", error);
      return { error: error.message };
    }
  }

  // Calculate player's total power in a game
  static async calculatePlayerPower(playerId) {
    try {
      const [rows] = await connect.query(
        `SELECT 
           w.name as warrior_name,
           w.level as warrior_level,
           w.health as warrior_health,
           w.energy as warrior_energy,
           SUM(CAST(p.damage AS UNSIGNED)) as total_power_damage
         FROM warrior_player wp
         JOIN warrior w ON wp.warrior_id = w.id
         LEFT JOIN warrior_power wpow ON w.id = wpow.warrior_id
         LEFT JOIN power p ON wpow.power_id = p.id
         WHERE wp.player_id = ?
         GROUP BY w.id`,
        [playerId]
      );

      let totalPower = 0;
      const warriors = [];
      rows.forEach((warrior) => {
        const warriorPower = parseInt(warrior.total_power_damage) || 0;
        totalPower += warriorPower;
        warriors.push({
          name: warrior.warrior_name,
          level: warrior.warrior_level,
          health: warrior.warrior_health,
          energy: warrior.warrior_energy,
          powerDamage: warriorPower,
        });
      });

      return {
        totalPower,
        warriors,
        warriorCount: warriors.length,
      };
    } catch (error) {
      console.error("Error calculating player power:", error);
      return { error: error.message, totalPower: 0, warriors: [] };
    }
  }

  // End game and determine winner
  static async endGame(gameCode) {
    try {
      const game = await this.findByCode(gameCode);

      if (!game) {
        return { error: "Game not found" };
      }

      if (game.players.length !== 2) {
        return { error: "Game needs exactly 2 players to end" };
      }

      // Calculate power for both players
      const player1 = game.players[0];
      const player2 = game.players[1];

      const player1Power = await this.calculatePlayerPower(
        player1.Player_FK_ID
      );
      const player2Power = await this.calculatePlayerPower(
        player2.Player_FK_ID
      );
      // Determine winner
      let winner, result;
      if (player1Power.totalPower > player2Power.totalPower) {
        winner = player1.player_name;
        result = `${player1.player_name} wins!`;
      } else if (player2Power.totalPower > player1Power.totalPower) {
        winner = player2.player_name;
        result = `${player2.player_name} wins!`;
      } else {
        winner = null;
        result = "It's a tie!";
      }
      // Update game with result
      await connect.query(
        `UPDATE game SET status_id = 3, result = ? WHERE id = ?`, // 3 = 'finished'
        [result, game.id]
      );

      return {
        success: true,
        result,
        winner,
        gameStats: {
          [player1.player_name]: {
            totalPower: player1Power.totalPower,
            warriors: player1Power.warriors,
          },
          [player2.player_name]: {
            totalPower: player2Power.totalPower,
            warriors: player2Power.warriors,
          },
        },
      };
    } catch (error) {
      console.error("Error ending game:", error);
      return { error: error.message };
    }
  }

  // Get all games (admin)
  static async getAllGames() {
    try {
      const [rows] = await connect.query(
        `SELECT g.*, gs.name as status,
                COUNT(pg.player_id) as player_count
         FROM game g
         JOIN game_status gs ON g.status_id = gs.id
         LEFT JOIN player_game pg ON g.id = pg.game_id
         GROUP BY g.id
         ORDER BY g.id DESC`
      );

      return rows;
    } catch (error) {
      console.error("Error getting all games:", error);
      return { error: error.message };
    }
  }

  // Get player's games
  static async getPlayerGames(playerId) {
    try {
      const [rows] = await connect.query(
        `SELECT g.*, gs.name as status
         FROM game g
         JOIN game_status gs ON g.status_id = gs.id
         JOIN player_game pg ON g.id = pg.game_id
         WHERE pg.player_id = ?
         ORDER BY g.id DESC`,
        [playerId]
      );

      return rows;
    } catch (error) {
      console.error("Error getting player games:", error);
      return { error: error.message };
    }
  }

  // Generate unique game code
  static generateGameCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export default GameModel;
