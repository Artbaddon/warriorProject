-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-05-2025 a las 04:09:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `warriorsdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `Admin_id` int(11) NOT NULL,
  `Admin_username` varchar(11) NOT NULL,
  `Admin_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `game`
--

CREATE TABLE `game` (
  `Game_id` int(11) NOT NULL,
  `Game_code` varchar(255) NOT NULL,
  `Game_expiration` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `GameStatus_FK_ID` int(11) NOT NULL,
  `Game_result` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gamestatus`
--

CREATE TABLE `gamestatus` (
  `GameStatus_id` int(11) NOT NULL,
  `GameStatus_name` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `magic`
--

CREATE TABLE `magic` (
  `Magic_id` int(11) NOT NULL,
  `Magic_image` float NOT NULL,
  `Magic_name` varchar(30) NOT NULL,
  `Magic_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `player`
--

CREATE TABLE `player` (
  `Player_id` int(11) NOT NULL,
  `Player_name` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `playergame`
--

CREATE TABLE `playergame` (
  `PlayerGame_id` int(11) NOT NULL,
  `Game_FK_ID` int(11) NOT NULL,
  `Player_FK_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `power`
--

CREATE TABLE `power` (
  `Power_id` int(11) NOT NULL,
  `Power_image` varchar(255) NOT NULL,
  `Power_name` varchar(30) NOT NULL,
  `Power_description` text NOT NULL,
  `Power_damage` varchar NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `race`
--

CREATE TABLE `race` (
  `Race_id` int(11) NOT NULL,
  `Race_image` varchar NOT NULL,
  `Race_name` varchar(30) NOT NULL,
  `Race_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warrior`
--

CREATE TABLE `warrior` (
  `Warrior_id` int(11) NOT NULL,
  `Warrior_image` varchar NOT NULL,
  `Warrior_name` varchar(30) NOT NULL,
  `Warrior_description` text NOT NULL,
  `Warrior_level` int(2) NOT NULL,
  `Warrior_health` float NOT NULL,
  `Warrior_energy` float NOT NULL,
  `WarriorType_FK_ID` int(11) NOT NULL,
  `Race_FK_ID` int(11) NOT NULL,
  `Magic_FK_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warriortype`
--

CREATE TABLE `warriortype` (
  `WarriorType_id` int(11) NOT NULL,
  `WarriorType_image` varchar NOT NULL,
  `WarriorType_name` varchar(30) NOT NULL,
  `WarriorType_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warrior_player`
--

CREATE TABLE `warrior_player` (
  `Warrior_Player_id` int(11) NOT NULL,
  `Warrior_FK_ID` int(11) NOT NULL,
  `Player_FK_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warrior_power`
--

CREATE TABLE `warrior_power` (
  `Warrior_Power_id` int(11) NOT NULL,
  `Warrior_FK_ID` int(11) NOT NULL,
  `Power_FK_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_id`),
  ADD UNIQUE KEY `Admin_username` (`Admin_username`);

--
-- Indices de la tabla `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`Game_id`),
  ADD UNIQUE KEY `Game_code` (`Game_code`),
  ADD KEY `GameStatus_FK_ID` (`GameStatus_FK_ID`);

--
-- Indices de la tabla `gamestatus`
--
ALTER TABLE `gamestatus`
  ADD PRIMARY KEY (`GameStatus_id`),
  ADD UNIQUE KEY `GameStatus_name` (`GameStatus_name`);

--
-- Indices de la tabla `magic`
--
ALTER TABLE `magic`
  ADD PRIMARY KEY (`Magic_id`),
  ADD UNIQUE KEY `Magic_name` (`Magic_name`);

--
-- Indices de la tabla `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`Player_id`),
  ADD UNIQUE KEY `Player_name` (`Player_name`);

--
-- Indices de la tabla `playergame`
--
ALTER TABLE `playergame`
  ADD PRIMARY KEY (`PlayerGame_id`),
  ADD KEY `Game_FK_ID` (`Game_FK_ID`),
  ADD KEY `Player_FK_ID` (`Player_FK_ID`);

--
-- Indices de la tabla `power`
--
ALTER TABLE `power`
  ADD PRIMARY KEY (`Power_id`),
  ADD UNIQUE KEY `Power_name` (`Power_name`);

--
-- Indices de la tabla `race`
--
ALTER TABLE `race`
  ADD PRIMARY KEY (`Race_id`),
  ADD UNIQUE KEY `Race_name` (`Race_name`);

--
-- Indices de la tabla `warrior`
--
ALTER TABLE `warrior`
  ADD PRIMARY KEY (`Warrior_id`),
  ADD KEY `WarriorType_FK_ID` (`WarriorType_FK_ID`),
  ADD KEY `Race_FK_ID` (`Race_FK_ID`),
  ADD KEY `Magic_FK_ID` (`Magic_FK_ID`);

--
-- Indices de la tabla `warriortype`
--
ALTER TABLE `warriortype`
  ADD PRIMARY KEY (`WarriorType_id`),
  ADD UNIQUE KEY `WarriorType_name` (`WarriorType_name`);

--
-- Indices de la tabla `warrior_player`
--
ALTER TABLE `warrior_player`
  ADD PRIMARY KEY (`Warrior_Player_id`),
  ADD KEY `Warrior_FK_ID` (`Warrior_FK_ID`),
  ADD KEY `Player_FK_ID` (`Player_FK_ID`);

--
-- Indices de la tabla `warrior_power`
--
ALTER TABLE `warrior_power`
  ADD PRIMARY KEY (`Warrior_Power_id`),
  ADD KEY `Warrior_FK_ID` (`Warrior_FK_ID`),
  ADD KEY `Power_FK_ID` (`Power_FK_ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `game`
--
ALTER TABLE `game`
  MODIFY `Game_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gamestatus`
--
ALTER TABLE `gamestatus`
  MODIFY `GameStatus_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `magic`
--
ALTER TABLE `magic`
  MODIFY `Magic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `player`
--
ALTER TABLE `player`
  MODIFY `Player_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `playergame`
--
ALTER TABLE `playergame`
  MODIFY `PlayerGame_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `power`
--
ALTER TABLE `power`
  MODIFY `Power_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `race`
--
ALTER TABLE `race`
  MODIFY `Race_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `warrior`
--
ALTER TABLE `warrior`
  MODIFY `Warrior_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `warriortype`
--
ALTER TABLE `warriortype`
  MODIFY `WarriorType_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `warrior_player`
--
ALTER TABLE `warrior_player`
  MODIFY `Warrior_Player_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `warrior_power`
--
ALTER TABLE `warrior_power`
  MODIFY `Warrior_Power_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `game_ibfk_1` FOREIGN KEY (`GameStatus_FK_ID`) REFERENCES `gamestatus` (`GameStatus_id`);

--
-- Filtros para la tabla `playergame`
--
ALTER TABLE `playergame`
  ADD CONSTRAINT `playergame_ibfk_1` FOREIGN KEY (`Game_FK_ID`) REFERENCES `game` (`Game_id`),
  ADD CONSTRAINT `playergame_ibfk_2` FOREIGN KEY (`Player_FK_ID`) REFERENCES `player` (`Player_id`);

--
-- Filtros para la tabla `warrior`
--
ALTER TABLE `warrior`
  ADD CONSTRAINT `warrior_ibfk_1` FOREIGN KEY (`WarriorType_FK_ID`) REFERENCES `warriortype` (`WarriorType_id`),
  ADD CONSTRAINT `warrior_ibfk_2` FOREIGN KEY (`Race_FK_ID`) REFERENCES `race` (`Race_id`),
  ADD CONSTRAINT `warrior_ibfk_3` FOREIGN KEY (`Magic_FK_ID`) REFERENCES `magic` (`Magic_id`);

--
-- Filtros para la tabla `warrior_player`
--
ALTER TABLE `warrior_player`
  ADD CONSTRAINT `warrior_player_ibfk_1` FOREIGN KEY (`Warrior_FK_ID`) REFERENCES `warrior` (`Warrior_id`),
  ADD CONSTRAINT `warrior_player_ibfk_2` FOREIGN KEY (`Player_FK_ID`) REFERENCES `player` (`Player_id`);

--
-- Filtros para la tabla `warrior_power`
--
ALTER TABLE `warrior_power`
  ADD CONSTRAINT `warrior_power_ibfk_1` FOREIGN KEY (`Warrior_FK_ID`) REFERENCES `warrior` (`Warrior_id`),
  ADD CONSTRAINT `warrior_power_ibfk_2` FOREIGN KEY (`Power_FK_ID`) REFERENCES `power` (`Power_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
