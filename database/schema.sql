-- Import this file in phpMyAdmin (or run it with the MySQL command line).
CREATE DATABASE IF NOT EXISTS nouryn_portfolio
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nouryn_portfolio;

CREATE TABLE portfolio_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category VARCHAR(48) NOT NULL,
  title VARCHAR(180) NOT NULL,
  subtitle VARCHAR(180) DEFAULT NULL,
  description TEXT NOT NULL,
  item_date DATE DEFAULT NULL,
  tags VARCHAR(500) DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  proof_url VARCHAR(500) DEFAULT NULL,
  external_url VARCHAR(500) DEFAULT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX portfolio_items_public_feed (category, is_published, item_date, created_at)
) ENGINE=InnoDB;
