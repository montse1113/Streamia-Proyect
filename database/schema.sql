-- Streamia - database schema (MySQL 8)
-- Run: mysql -u root -p < database/schema.sql
-- Table and column names follow docs/e-r_diagram.png

DROP DATABASE IF EXISTS streamia;
CREATE DATABASE streamia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE streamia;

-- users
-- password stores the bcrypt hash, never the real password
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- plans
-- price is in MXN, price_id is the Stripe price id (filled in sprint 3)
CREATE TABLE plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  max_quality ENUM('SD', 'HD', '4K') NOT NULL,
  max_screens INT NOT NULL,
  price_id VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- genres
CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- titles (movies and series)
-- duration_min and video_url are only for movies, series use episodes
CREATE TABLE titles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('movie', 'series') NOT NULL,
  title VARCHAR(150) NOT NULL,
  synopsis TEXT,
  release_year INT,
  age_rating VARCHAR(10),
  duration_min INT,
  poster_url VARCHAR(500),
  video_url VARCHAR(500),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- title_genres (many to many between titles and genres)
CREATE TABLE title_genres (
  title_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (title_id, genre_id),
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- seasons
CREATE TABLE seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_id INT NOT NULL,
  number INT NOT NULL,
  UNIQUE (title_id, number),
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
);

-- episodes
CREATE TABLE episodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  season_id INT NOT NULL,
  number INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  duration_min INT,
  video_url VARCHAR(500) NOT NULL,
  UNIQUE (season_id, number),
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

-- subscriptions
-- starts as pending, only the Stripe webhook changes it to active
-- one active subscription per user is checked in the backend
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  status ENUM('pending', 'active', 'past_due', 'canceled', 'expired') NOT NULL DEFAULT 'pending',
  stripe_subs_id VARCHAR(255) UNIQUE,
  current_period_end DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- payments
-- stripe_event_id is unique so the same webhook event is not saved twice
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'MXN',
  status ENUM('succeeded', 'failed', 'refunded') NOT NULL,
  stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
  paid_at DATETIME,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- favorites (My List)
CREATE TABLE favorites (
  user_id INT NOT NULL,
  title_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, title_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
);

-- watch_progress
-- episode_id is NULL when the title is a movie
CREATE TABLE watch_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title_id INT NOT NULL,
  episode_id INT NULL,
  position_sec INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (user_id, title_id, episode_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);


-- ---------- test data ----------

INSERT INTO plans (name, price, max_quality, max_screens) VALUES
('Basic', 99.00, 'SD', 1),
('Standard', 149.00, 'HD', 2),
('Premium', 199.00, '4K', 4);

-- passwords are bcrypt hashes (cost 10)
INSERT INTO users (name, last_name, email, password, role) VALUES
('Admin', 'Streamia', 'admin@streamia.test', '$2a$10$ZIS.hSOPnvVTe.KHEY7mGOhYWCGtXAQq4DTo5AMjvIVO6cwI1zDzy', 'admin'),
('Test', 'Customer', 'customer@streamia.test', '$2a$10$wOrIX06wBMPamHFn5xivEOf3yE9saRssXhV7qNyCOfbJ.6JNxDIGa', 'customer');

INSERT INTO genres (name) VALUES
('Action'), ('Animation'), ('Comedy'), ('Drama'), ('Fantasy'), ('Science Fiction');

-- test videos from the Google sample bucket (Blender open movies)
INSERT INTO titles (type, title, synopsis, release_year, age_rating, duration_min, poster_url, video_url) VALUES
('movie', 'Big Buck Bunny', 'A big rabbit gets revenge on three rodents.', 2008, 'AA', 10, 'https://placehold.co/300x450?text=Big+Buck+Bunny', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
('movie', 'Elephants Dream', 'Two men explore a strange machine.', 2006, 'B', 11, 'https://placehold.co/300x450?text=Elephants+Dream', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'),
('movie', 'Sintel', 'A girl looks for her lost baby dragon.', 2010, 'B', 15, 'https://placehold.co/300x450?text=Sintel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'),
('movie', 'Tears of Steel', 'Scientists try to save the world from robots.', 2012, 'B', 12, 'https://placehold.co/300x450?text=Tears+of+Steel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'),
('movie', 'For Bigger Blazes', 'Short test video.', 2014, 'A', 1, 'https://placehold.co/300x450?text=For+Bigger+Blazes', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'),
('movie', 'For Bigger Escapes', 'Short test video.', 2014, 'A', 1, 'https://placehold.co/300x450?text=For+Bigger+Escapes', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'),
('movie', 'For Bigger Fun', 'Short test video.', 2014, 'A', 1, 'https://placehold.co/300x450?text=For+Bigger+Fun', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'),
('series', 'The Open Lab', 'A group of students build a new invention in every episode.', 2024, 'A', NULL, 'https://placehold.co/300x450?text=The+Open+Lab', NULL);

INSERT INTO title_genres (title_id, genre_id) VALUES
(1, 2), (1, 3),
(2, 2), (2, 6),
(3, 2), (3, 5),
(4, 1), (4, 6),
(5, 1),
(6, 4),
(7, 3),
(8, 3), (8, 6);

-- The Open Lab (title 8) has 2 seasons with 2 episodes each
INSERT INTO seasons (title_id, number) VALUES
(8, 1),
(8, 2);

INSERT INTO episodes (season_id, number, name, duration_min, video_url) VALUES
(1, 1, 'The First Prototype', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'),
(1, 2, 'Short Circuit', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'),
(2, 1, 'Back to the Lab', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'),
(2, 2, 'Final Test', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
