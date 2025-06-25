import GameModel from "../models/game.model.js";
import WarriorModel from "../models/warrior.model.js";
import WarriorPlayerModel from "../models/warriorPlayer.model.js";

class GameController {
  /**
   * Create a new game with auto-generated game code
   * @route POST /games
   * @group Games - Game management operations
   * @param {number} expirationMinutes.body - Game expiration time in minutes (default: 30)
   * @returns {object} 201 - Game created successfully
   * @returns {object} 500 - Server error or game creation failed
   * @security Bearer (Admin)
   * @example
   * Request:
   * {
   *   "expirationMinutes": 30
   * }
   *
   * Response:
   * {
   *   "message": "Game created successfully",
   *   "game": {
   *     "gameId": 1,
   *     "gameCode": "ABC123",
   *     "expiration": "2025-06-23T15:30:00.000Z",
   *     "status": "waiting"
   *   }
   * }
   */
  async create(req, res) {
    try {
      const { expirationMinutes } = req.body;

      const gameCode = GameModel.generateGameCode();
      const game = await GameModel.create({
        gameCode,
        expirationMinutes: expirationMinutes || 30,
      });

      if (game.error) {
        return res.status(500).json({ error: game.error });
      }

      res.status(201).json({
        message: "Game created successfully",
        game: {
          gameId: game.gameId,
          gameCode: game.gameCode,
          expiration: game.expiration,
          status: game.status,
        },
      });
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Join an existing game with a player's warrior
   * @route POST /games/join
   * @group Games - Game management operations
   * @param {string} gameCode.body.required - Game code to join
   * @returns {object} 200 - Successfully joined game
   * @returns {Error} 400 - Bad request (missing game code, no warrior, game full)
   * @returns {Error} 401 - Unauthorized (invalid token)
   * @returns {Error} 500 - Server error
   * @security Bearer (Player)
   * @example
   * Request:
   * {
   *   "gameCode": "ABC123"
   * }
   *
   * Response:
   * {
   *   "message": "Successfully joined game",
   *   "gameStatus": "waiting",
   *   "gameCode": "ABC123"
   * }
   */
  async joinGame(req, res) {
    try {
      const { gameCode } = req.body;
      const playerId = req.player.id;
      const playerHasWarrior = await WarriorModel.getPlayerWarrior(playerId);
      if (!playerHasWarrior) {
        return res.status(400).json({
          error: "You must have a warrior to join a game",
        });
      }

      if (!gameCode) {
        return res.status(400).json({ error: "Game code is required" });
      }

      const result = await GameModel.joinGame(gameCode, playerId);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(200).json({
        message: result.message,
        gameStatus: result.gameStatus,
        gameCode: gameCode,
      });
    } catch (error) {
      console.error("Error joining game:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get current status of a game including players and game state
   * @route GET /games/:gameCode/status
   * @group Games - Game management operations
   * @param {string} gameCode.path.required - Game code to check status
   * @returns {object} 200 - Game status retrieved successfully
   * @returns {Error} 404 - Game not found
   * @returns {Error} 500 - Server error
   * @security None (Public)
   * @example
   * Response:
   * {
   *   "gameCode": "ABC123",
   *   "status": "waiting",
   *   "playersCount": 1,
   *   "maxPlayers": 2,
   *   "expiration": "2025-06-23T15:30:00.000Z",
   *   "result": null,
   *   "players": [
   *     {
   *       "name": "Player1",
   *       "id": 1
   *     }
   *   ]
   * }
   */
  async getGameStatus(req, res) {
    try {
      const { gameCode } = req.params;

      const game = await GameModel.findByCode(gameCode);

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (game.error) {
        return res.status(500).json({ error: game.error });
      }

      res.status(200).json({
        gameCode: game.Game_code,
        status: game.status,
        playersCount: game.players.length,
        maxPlayers: 2,
        expiration: game.Game_expiration,
        result: game.Game_result,
        players: game.players.map((p) => ({
          name: p.Player_name,
          id: p.Player_FK_ID,
        })),
      });
    } catch (error) {
      console.error("Error getting game status:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * End a game and calculate the winner based on warrior power
   * @route POST /games/end
   * @group Games - Game management operations
   * @param {string} gameCode.body.required - Game code to end
   * @returns {object} 200 - Game ended successfully with winner results
   * @returns {Error} 400 - Bad request (missing game code, invalid game state)
   * @returns {Error} 401 - Unauthorized (invalid token)
   * @returns {Error} 500 - Server error
   * @security Bearer (Player or Admin)
   * @example
   * Request:
   * {
   *   "gameCode": "ABC123"
   * }
   *
   * Response:
   * {
   *   "message": "Game ended successfully",
   *   "result": "Player1 wins!",
   *   "winner": "Player1",
   *   "gameStats": {
   *     "Player1": {
   *       "totalPower": 150,
   *       "warriors": [...]
   *     },
   *     "Player2": {
   *       "totalPower": 120,
   *       "warriors": [...]
   *     }
   *   }
   * }
   */
  async endGame(req, res) {
    try {
      const { gameCode } = req.body;

      if (!gameCode) {
        return res.status(400).json({ error: "Game code is required" });
      }

      const result = await GameModel.endGame(gameCode);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(200).json({
        message: "Game ended successfully",
        result: result.result,
        winner: result.winner,
        gameStats: result.gameStats,
      });
    } catch (error) {
      console.error("Error ending game:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all games in the system with their status and player count
   * @route GET /games
   * @group Games - Game management operations
   * @returns {object} 200 - All games retrieved successfully
   * @returns {Error} 401 - Unauthorized (invalid admin token)
   * @returns {Error} 500 - Server error
   * @security Bearer (Admin)
   * @example
   * Response:
   * {
   *   "message": "Games retrieved successfully",
   *   "games": [
   *     {
   *       "id": 1,
   *       "code": "ABC123",
   *       "status": "waiting",
   *       "player_count": 1,
   *       "expiration": "2025-06-23T15:30:00.000Z",
   *       "result": null
   *     }
   *   ]
   * }
   */
  async getAllGames(req, res) {
    try {
      const games = await GameModel.getAllGames();

      if (games.error) {
        return res.status(500).json({ error: games.error });
      }

      res.status(200).json({
        message: "Games retrieved successfully",
        games: games,
      });
    } catch (error) {
      console.error("Error getting all games:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all games that the authenticated player has participated in
   * @route GET /player/games
   * @group Games - Game management operations
   * @returns {object} 200 - Player games retrieved successfully
   * @returns {Error} 401 - Unauthorized (invalid player token)
   * @returns {Error} 500 - Server error
   * @security Bearer (Player)
   * @example
   * Response:
   * {
   *   "message": "Player games retrieved successfully",
   *   "games": [
   *     {
   *       "id": 1,
   *       "code": "ABC123",
   *       "status": "finished",
   *       "expiration": "2025-06-23T15:30:00.000Z",
   *       "result": "Player1 wins!"
   *     }
   *   ]
   * }
   */
  async getPlayerGames(req, res) {
    try {
      const playerId = req.player.id; // From JWT middleware

      const games = await GameModel.getPlayerGames(playerId);

      if (games.error) {
        return res.status(500).json({ error: games.error });
      }

      res.status(200).json({
        message: "Player games retrieved successfully",
        games: games,
      });
    } catch (error) {
      console.error("Error getting player games:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Calculate and return the total power of the authenticated player's warriors
   * @route GET /player/power
   * @group Games - Game management operations
   * @returns {object} 200 - Player power calculated successfully
   * @returns {Error} 401 - Unauthorized (invalid player token)
   * @returns {Error} 500 - Server error
   * @security Bearer (Player)
   * @example
   * Response:
   * {
   *   "message": "Player power calculated successfully",
   *   "totalPower": 150,
   *   "warriors": [
   *     {
   *       "name": "Aragorn",
   *       "level": 5,
   *       "health": 120,
   *       "energy": 80,
   *       "powerDamage": 75
   *     }
   *   ],
   *   "warriorCount": 1
   * }
   */
  async getMyPower(req, res) {
    try {
      const playerId = req.player.id; // From JWT middleware

      const powerData = await GameModel.calculatePlayerPower(playerId);

      if (powerData.error) {
        return res.status(500).json({ error: powerData.error });
      }

      res.status(200).json({
        message: "Player power calculated successfully",
        totalPower: powerData.totalPower,
        warriors: powerData.warriors,
        warriorCount: powerData.warriorCount,
      });
    } catch (error) {
      console.error("Error calculating player power:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Simulate a battle between two players in a game without ending the game
   * @route GET /games/:gameCode/simulate
   * @group Games - Game management operations
   * @param {string} gameCode.path.required - Game code to simulate battle
   * @returns {object} 200 - Battle simulation completed successfully
   * @returns {Error} 400 - Bad request (need exactly 2 players)
   * @returns {Error} 404 - Game not found
   * @returns {Error} 500 - Server error
   * @security None (Public)
   * @example
   * Response:
   * {
   *   "message": "Battle simulation",
   *   "gameCode": "ABC123",
   *   "battle": {
   *     "Player1": {
   *       "totalPower": 150,
   *       "warriors": [...]
   *     },
   *     "Player2": {
   *       "totalPower": 120,
   *       "warriors": [...]
   *     }
   *   },
   *   "prediction": "Player1 would win!"
   * }
   */
  async simulateBattle(req, res) {
    try {
      const { gameCode } = req.params;

      const game = await GameModel.findByCode(gameCode);

      if (!game || game.error) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (game.players.length !== 2) {
        return res
          .status(400)
          .json({ error: "Need exactly 2 players for battle" });
      }

      const player1 = game.players[0];
      const player2 = game.players[1];

      const player1Power = await GameModel.calculatePlayerPower(
        player1.Player_FK_ID
      );
      const player2Power = await GameModel.calculatePlayerPower(
        player2.Player_FK_ID
      );

      res.status(200).json({
        message: "Battle simulation",
        gameCode: gameCode,
        battle: {
          [player1.Player_name]: {
            totalPower: player1Power.totalPower,
            warriors: player1Power.warriors,
          },
          [player2.Player_name]: {
            totalPower: player2Power.totalPower,
            warriors: player2Power.warriors,
          },
        },
        prediction:
          player1Power.totalPower > player2Power.totalPower
            ? `${player1.Player_name} would win!`
            : player2Power.totalPower > player1Power.totalPower
            ? `${player2.Player_name} would win!`
            : "It would be a tie!",
      });
    } catch (error) {
      console.error("Error simulating battle:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GameController();
