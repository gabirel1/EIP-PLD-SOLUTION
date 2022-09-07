CREATE DATABASE IF NOT EXISTS PldHandler;
USE PldHandler;

CREATE TABLE IF NOT EXISTS `users` (
  `uuid` VARCHAR(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`uuid`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cards` (
  `uuid` VARCHAR(36) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `card_name` varchar(255) NOT NULL,
  `card_number` INT NOT NULL,
  `card_description` varchar(255) NOT NULL,
  `card_as_a` varchar(255) NOT NULL,
  `card_i_want_to` varchar(255) NOT NULL,
  `card_definition_of_done` varchar(255) NOT NULL,
  `card_estimated_time` INT NOT NULL,
  `card_assigned_user_uuid` varchar(36),
  FOREIGN KEY (`card_assigned_user_uuid`) REFERENCES `users` (`uuid`),
  PRIMARY KEY (`uuid`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `categories` (
  `uuid` VARCHAR(36) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_current_card_number` INT NOT NULL,
  PRIMARY KEY (`uuid`)
) DEFAULT CHARSET=utf8;