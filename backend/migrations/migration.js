import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { encryptPassword } from "../library/appBcrypt.js";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "warriorsdb",
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
};

const sqlStatements = [
  `DROP DATABASE IF EXISTS ${dbConfig.database};`,
  `CREATE DATABASE IF NOT EXISTS ${dbConfig.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `USE ${dbConfig.database};`,

  // Admin table 
  `CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Game Status table
  `CREATE TABLE game_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Race table
  `CREATE TABLE race (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Warrior Type
  `CREATE TABLE warrior_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Magic table
  `CREATE TABLE magic (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    mana_cost INT DEFAULT 10,
    damage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Power table
  `CREATE TABLE power (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    damage VARCHAR(50) NOT NULL,
    cooldown INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Player table
  `CREATE TABLE player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Warrior table 
  `CREATE TABLE warrior (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    level INT DEFAULT 1,
    health DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    energy DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    attack INT DEFAULT 10,
    defense INT DEFAULT 5,
    speed INT DEFAULT 5,
    warrior_type_id INT NOT NULL,
    race_id INT NOT NULL,
    magic_id INT DEFAULT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warrior_type_id) REFERENCES warrior_type(id) ON DELETE RESTRICT,
    FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE RESTRICT,
    FOREIGN KEY (magic_id) REFERENCES magic(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  // Game table
  `CREATE TABLE game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    expiration TIMESTAMP NULL DEFAULT NULL,
    result VARCHAR(100) DEFAULT NULL,
    status_id INT NOT NULL DEFAULT 1,
    FOREIGN KEY (status_id) REFERENCES game_status(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  // Player-Game
  `CREATE TABLE player_game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES player(id) ON DELETE CASCADE,
    UNIQUE KEY uk_player_game (game_id, player_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  // Warrior-Player
  `CREATE TABLE warrior_player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    warrior_id INT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (warrior_id) REFERENCES warrior(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES player(id) ON DELETE CASCADE,
    UNIQUE KEY uk_warrior_player (warrior_id, player_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  // Warrior-Power
  `CREATE TABLE warrior_power (
    id INT AUTO_INCREMENT PRIMARY KEY,
    warrior_id INT NOT NULL,
    power_id INT NOT NULL,
    FOREIGN KEY (warrior_id) REFERENCES warrior(id) ON DELETE CASCADE,
    FOREIGN KEY (power_id) REFERENCES power(id) ON DELETE CASCADE,
    UNIQUE KEY uk_warrior_power (warrior_id, power_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Fixed stored procedures
  `DROP PROCEDURE IF EXISTS sp_get_player_warriors;`,  `CREATE PROCEDURE sp_get_player_warriors(IN p_player_id INT)
  BEGIN
    SELECT 
      w.id as warrior_id,
      w.name as warrior_name,
      w.description,
      w.image,
      w.level,
      w.health,
      w.energy,
      w.attack,
      w.defense,
      w.speed,
      r.name as race_name,
      wt.name as warrior_type_name,
      m.name as magic_name
    FROM warrior_player wp
    INNER JOIN warrior w ON wp.warrior_id = w.id
    INNER JOIN race r ON w.race_id = r.id
    INNER JOIN warrior_type wt ON w.warrior_type_id = wt.id
    LEFT JOIN magic m ON w.magic_id = m.id
    WHERE wp.player_id = p_player_id
    ORDER BY w.level DESC, w.name ASC;
  END;`,
  `DROP PROCEDURE IF EXISTS sp_get_game_details;`,
  `CREATE PROCEDURE sp_get_game_details(IN p_game_code VARCHAR(10))
  BEGIN
    SELECT 
      g.id,
      g.code,
      g.expiration,
      g.result,
      gs.name as status_name,
      COUNT(DISTINCT pg.player_id) as current_players,
      GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') as player_names
    FROM game g
    INNER JOIN game_status gs ON g.status_id = gs.id
    LEFT JOIN player_game pg ON g.id = pg.game_id
    LEFT JOIN player p ON pg.player_id = p.id
    WHERE g.code = p_game_code
    GROUP BY g.id, g.code, g.expiration, g.result, gs.name;
  END;`,

  `DROP PROCEDURE IF EXISTS sp_get_all_warriors_info;`,
  `CREATE PROCEDURE sp_get_all_warriors_info()
  BEGIN
    SELECT 
      w.id as warrior_id,
      w.name as warrior_name,
      w.description as warrior_description,
      w.image as warrior_image,
      w.level,
      w.health,
      w.energy,
      w.attack,
      w.defense,
      w.speed,
      w.is_available,
      r.id as race_id,
      r.name as race_name,
      r.description as race_description,
      r.image as race_image,
      wt.id as warrior_type_id,
      wt.name as warrior_type_name,
      wt.description as warrior_type_description,
      wt.image as warrior_type_image,
      m.id as magic_id,
      m.name as magic_name,
      m.description as magic_description,
      m.image as magic_image,
      m.mana_cost,
      m.damage as magic_damage,
      GROUP_CONCAT(
        CONCAT(
          '{"id":', p.id, 
          ',"name":"', p.name, 
          '","description":"', p.description, 
          '","image":"', p.image, 
          '","damage":"', p.damage, 
          '","cooldown":', p.cooldown, '}'
        ) SEPARATOR ','
      ) as powers
    FROM warrior w
    INNER JOIN race r ON w.race_id = r.id
    INNER JOIN warrior_type wt ON w.warrior_type_id = wt.id
    LEFT JOIN magic m ON w.magic_id = m.id
    LEFT JOIN warrior_power wp ON w.id = wp.warrior_id
    LEFT JOIN power p ON wp.power_id = p.id    GROUP BY w.id, r.id, wt.id, m.id
    ORDER BY w.level DESC, w.name ASC;
  END;`,

  `DROP PROCEDURE IF EXISTS sp_get_warrior_info;`,
  `CREATE PROCEDURE sp_get_warrior_info(IN p_warrior_id INT)
  BEGIN
    SELECT 
      w.id as warrior_id,
      w.name as warrior_name,
      w.description as warrior_description,
      w.image as warrior_image,
      w.level,
      w.health,
      w.energy,
      w.attack,
      w.defense,
      w.speed,
      w.is_available,
      r.id as race_id,
      r.name as race_name,
      r.description as race_description,
      r.image as race_image,
      wt.id as warrior_type_id,
      wt.name as warrior_type_name,
      wt.description as warrior_type_description,
      wt.image as warrior_type_image,
      m.id as magic_id,
      m.name as magic_name,
      m.description as magic_description,
      m.image as magic_image,
      m.mana_cost,
      m.damage as magic_damage,
      GROUP_CONCAT(
        CONCAT(
          '{"id":', p.id, 
          ',"name":"', p.name, 
          '","description":"', p.description, 
          '","image":"', p.image, 
          '","damage":"', p.damage, 
          '","cooldown":', p.cooldown, '}'
        ) SEPARATOR ','
      ) as powers
    FROM warrior w
    INNER JOIN race r ON w.race_id = r.id
    INNER JOIN warrior_type wt ON w.warrior_type_id = wt.id
    LEFT JOIN magic m ON w.magic_id = m.id
    LEFT JOIN warrior_power wp ON w.id = wp.warrior_id
    LEFT JOIN power p ON wp.power_id = p.id
    WHERE w.id = p_warrior_id
    GROUP BY w.id, r.id, wt.id, m.id;
  END;`,

  
];

export async function runMigration() {
  let connection;
  try {
    console.log("🎮 Starting Warriors Database Migration...");
    connection = await mysql.createConnection(dbConfig);

    for (const sql of sqlStatements) {
      await connection.query(sql);
    }
    console.log("✅ Warriors Migration completed successfully");

    const testDataResult = await createTestData(connection);
    return { success: true, testDataCreated: testDataResult.success };
  } catch (error) {
    console.error("❌ Error during Warriors migration:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fixed test data
async function createTestData(connection) {
  try {
    const testData = [
      `INSERT INTO game_status (id, name, description) VALUES
      (1, 'Waiting', 'Waiting for players to join'),
      (2, 'Active', 'Game is currently being played'),
      (3, 'Finished', 'Game has completed'),
      (4, 'Cancelled', 'Game was cancelled');`,

      `INSERT INTO race (id, name, description, image) VALUES
      (1, 'Human', 'Balanced warriors with good adaptability', 'human.jpg'),
      (2, 'Elf', 'Agile and magical beings', 'elf.jpg'),
      (3, 'Orc', 'Strong and brutal fighters', 'orc.jpg'),
      (4, 'Dwarf', 'Tough and resilient', 'dwarf.jpg');`,

      `INSERT INTO warrior_type (id, name, description, image) VALUES
      (1, 'Warrior', 'Melee fighter with high defense', 'warrior.jpg'),
      (2, 'Mage', 'Magic user with powerful spells', 'mage.jpg'),
      (3, 'Archer', 'Ranged fighter with high precision', 'archer.jpg');`,

      `INSERT INTO magic (id, name, description, image, mana_cost, damage) VALUES
      (1, 'Fireball', 'Deals fire damage', 'fireball.jpg', 15, 35),
      (2, 'Heal', 'Restores health', 'heal.jpg', 20, 0),
      (3, 'Lightning', 'Electric attack', 'lightning.jpg', 25, 45);`,

      `INSERT INTO power (id, name, description, image, damage, cooldown) VALUES
      (1, 'Berserker Rage', 'Increases attack power', 'rage.jpg', '0', 5),
      (2, 'Critical Strike', 'Double damage attack', 'critical.jpg', 'x2', 3);`,

      // Only admin needs login
      `INSERT INTO admin (id, username, password) VALUES
      (1, 'admin', '${await encryptPassword("admin123")}');`,

      // Players just enter with names - NO LOGIN
      `INSERT INTO player (id, name) VALUES
      (1, 'Aragorn_Player'),
      (2, 'Legolas_Fan'),
      (3, 'WarriorMaster');`,      `INSERT INTO warrior (id, name, description, image, level, health, energy, attack, defense, speed, warrior_type_id, race_id, magic_id) VALUES
      (1, 'Aragorn', 'Noble human warrior', 'aragorn.jpg', 5, 120.00, 80.00, 25, 20, 15, 1, 1, NULL),
      (2, 'Legolas', 'Elven archer', 'legolas.jpg', 6, 100.00, 90.00, 30, 15, 25, 3, 2, NULL),
      (3, 'Gandalf', 'Powerful wizard', 'gandalf.jpg', 8, 90.00, 150.00, 15, 10, 12, 2, 1, 1);`,

      `INSERT INTO warrior_player (warrior_id, player_id) VALUES
      (1, 1),
      (2, 2),
      (3, 3);`,

      `INSERT INTO warrior_power (warrior_id, power_id) VALUES
      (1, 1),
      (1, 2),
      (2, 1),
      (3, 2);`,
    ];

    for (const query of testData) {
      await connection.query(query);
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error creating test data:", error);
    return { success: false, error: error.message };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().then((result) => {
    if (result.success) {
      console.log("🎉 Warriors Database is ready!");
      process.exit(0);
    } else {
      console.error("💥 Migration failed:", result.error);
      process.exit(1);
    }
  });
}
