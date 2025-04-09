-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2025 at 07:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `college_sensor_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `daily_aggregates`
--

CREATE TABLE `daily_aggregates` (
  `aggregate_id` int(11) NOT NULL,
  `sensor_id` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `avg_temperature` decimal(5,2) DEFAULT NULL,
  `min_temperature` decimal(5,2) DEFAULT NULL,
  `max_temperature` decimal(5,2) DEFAULT NULL,
  `avg_humidity` decimal(5,2) DEFAULT NULL,
  `min_humidity` decimal(5,2) DEFAULT NULL,
  `max_humidity` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_aggregates`
--

INSERT INTO `daily_aggregates` (`aggregate_id`, `sensor_id`, `date`, `avg_temperature`, `min_temperature`, `max_temperature`, `avg_humidity`, `min_humidity`, `max_humidity`) VALUES
(1, 'sen1', '2025-02-27', 25.40, 25.40, 25.40, 60.20, 60.20, 60.20),
(2, 'sen2', '2025-02-27', 26.10, 26.10, 26.10, 58.90, 58.90, 58.90),
(4, 'sen1', '2025-02-27', 30.20, 25.40, 35.00, 62.60, 60.20, 65.00),
(5, 'sen2', '2025-02-27', 28.05, 26.10, 30.00, 54.90, 50.90, 58.90),
(7, 'sen1', '2025-02-27', 30.23, 25.40, 35.00, 61.30, 55.00, 65.00),
(8, 'sen2', '2025-02-27', 28.05, 26.10, 30.00, 55.23, 50.90, 60.20),
(10, 'sen1', '2025-02-27', 31.18, 25.40, 35.00, 62.04, 55.00, 65.00),
(11, 'sen2', '2025-02-27', 28.44, 26.10, 30.00, 54.36, 50.90, 60.20),
(13, 'sen1', '2025-02-27', 31.82, 25.40, 35.00, 62.53, 55.00, 65.00),
(14, 'sen2', '2025-02-27', 28.70, 26.10, 30.00, 53.78, 50.90, 60.20),
(16, 'sen1', '2025-02-27', 32.27, 25.40, 35.00, 62.89, 55.00, 65.00),
(17, 'sen2', '2025-02-27', 28.89, 26.10, 30.00, 53.37, 50.90, 60.20),
(18, 'sen21', '2025-02-27', 35.00, 35.00, 35.00, 65.00, 65.00, 65.00),
(19, 'sen22', '2025-02-27', 30.00, 30.00, 30.00, 50.90, 50.90, 50.90),
(21, 'sen21', '2025-02-27', 40.00, 35.00, 45.00, 66.00, 65.00, 67.00),
(22, 'sen22', '2025-02-27', 31.00, 30.00, 32.00, 54.45, 50.90, 58.00);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`) VALUES
(9, 'Room222'),
(11, 'Room 231');

-- --------------------------------------------------------

--
-- Table structure for table `sensors`
--

CREATE TABLE `sensors` (
  `sensor_id` varchar(50) NOT NULL,
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensors`
--

INSERT INTO `sensors` (`sensor_id`, `room_id`) VALUES
('sen1', 9),
('sen2', 9),
('sen21', 11),
('sen22', 11);

-- --------------------------------------------------------

--
-- Table structure for table `sensor_readings`
--

CREATE TABLE `sensor_readings` (
  `reading_id` bigint(20) NOT NULL,
  `sensor_id` varchar(50) DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor_readings`
--

INSERT INTO `sensor_readings` (`reading_id`, `sensor_id`, `temperature`, `humidity`, `timestamp`) VALUES
(15, 'sen1', 25.40, 60.20, '2025-02-27 02:04:34'),
(16, 'sen2', 26.10, 58.90, '2025-02-27 02:04:34'),
(17, 'sen1', 35.00, 65.00, '2025-02-27 02:05:23'),
(18, 'sen2', 30.00, 50.90, '2025-02-27 02:05:23'),
(19, 'sen1', 25.50, 55.00, '2025-02-27 02:20:31'),
(20, 'sen2', 26.10, 60.20, '2025-02-27 02:20:31'),
(21, 'sen1', 24.80, 54.30, '2025-02-26 02:20:31'),
(22, 'sen2', 25.90, 58.70, '2025-02-26 02:20:31'),
(23, 'sen1', 35.00, 65.00, '2025-02-27 02:58:38'),
(24, 'sen2', 30.00, 50.90, '2025-02-27 02:58:38'),
(25, 'sen1', 35.00, 65.00, '2025-02-27 03:27:53'),
(26, 'sen2', 30.00, 50.90, '2025-02-27 03:27:53'),
(27, 'sen1', 35.00, 65.00, '2025-02-27 03:28:15'),
(28, 'sen2', 30.00, 50.90, '2025-02-27 03:28:15'),
(29, 'sen1', 35.00, 65.00, '2025-02-27 03:28:40'),
(30, 'sen2', 30.00, 50.90, '2025-02-27 03:28:40'),
(31, 'sen21', 35.00, 65.00, '2025-02-27 17:16:29'),
(32, 'sen22', 30.00, 50.90, '2025-02-27 17:16:29'),
(33, 'sen21', 45.00, 67.00, '2025-02-27 17:17:08'),
(34, 'sen22', 32.00, 58.00, '2025-02-27 17:17:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_aggregates`
--
ALTER TABLE `daily_aggregates`
  ADD PRIMARY KEY (`aggregate_id`),
  ADD KEY `idx_daily_aggregates` (`sensor_id`,`date`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`sensor_id`),
  ADD KEY `fk_sensors_room` (`room_id`);

--
-- Indexes for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD PRIMARY KEY (`reading_id`),
  ADD KEY `idx_sensor_timestamp` (`sensor_id`,`timestamp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daily_aggregates`
--
ALTER TABLE `daily_aggregates`
  MODIFY `aggregate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  MODIFY `reading_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `daily_aggregates`
--
ALTER TABLE `daily_aggregates`
  ADD CONSTRAINT `daily_aggregates_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`sensor_id`);

--
-- Constraints for table `sensors`
--
ALTER TABLE `sensors`
  ADD CONSTRAINT `fk_sensors_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sensors_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Constraints for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD CONSTRAINT `fk_readings_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`sensor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sensor_readings_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`sensor_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
