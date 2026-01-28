-- Local Roots Commerce Database Schema

CREATE DATABASE IF NOT EXISTS local_roots;
USE local_roots;

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hero_image VARCHAR(255),
    vendor_count INT DEFAULT 0,
    product_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    community VARCHAR(50) NOT NULL,
    vendor VARCHAR(255),
    stock INT DEFAULT 0,
    image VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_community (community),
    INDEX idx_category (category),
    INDEX idx_vendor (vendor)
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role ENUM('buyer', 'seller', 'both', 'admin') DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Community stories table
CREATE TABLE IF NOT EXISTS community_stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id INT,
    slug VARCHAR(255) UNIQUE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Insert sample communities
INSERT INTO communities (id, name, description, hero_image, vendor_count, product_count) VALUES
('kendem', 'Kendem', 'Discover unique products and support local artisans.', 'kendem-hero.jpg', 50, 100),
('mamfe', 'Mamfe', 'Discover unique products and support local artisans.', 'mamfe-hero.jpg', 50, 100),
('membe', 'Membe', 'Discover unique products and support local artisans.', 'membe-hero.jpg', 50, 100),
('widikum', 'Widikum', 'Discover unique products and support local artisans.', 'widikum-hero.jpg', 50, 100),
('fonjo', 'Fonjo', 'Discover unique products and support local artisans.', 'fonjo-hero.jpg', 50, 100),
('moshie-kekpoti', 'Moshie/Kekpoti', 'Discover unique products and support local artisans.', 'moshie-kekpoti-hero.png', 50, 100);

-- Insert sample products
INSERT INTO products (name, price, description, category, community, vendor, stock, image, rating, reviews) VALUES
('Handwoven Basket', 15000.00, 'Beautiful handwoven basket made from local materials', 'Crafts', 'kendem', 'Marie Nguema', 10, 'https://via.placeholder.com/300x200?text=Handwoven+Basket', 4.5, 12),
('Fresh Cocoa Beans', 8000.00, 'Premium quality cocoa beans from local farms', 'Food', 'mamfe', 'Farm Fresh', 25, 'https://via.placeholder.com/300x200?text=Fresh+Cocoa+Beans', 4.8, 8),
('Wooden Carving', 25000.00, 'Intricate wooden carving representing local culture', 'Crafts', 'membe', 'Master Craftsman', 5, 'https://via.placeholder.com/300x200?text=Wooden+Carving', 4.9, 15),
('Palm Oil', 5000.00, 'Pure, unrefined palm oil from local producers', 'Food', 'widikum', 'Oil Producers Coop', 50, 'https://via.placeholder.com/300x200?text=Palm+Oil', 4.3, 20),
('Ceramic Pottery', 18000.00, 'Beautiful ceramic pottery with traditional designs', 'Crafts', 'fonjo', 'Grace Moshie', 12, 'https://via.placeholder.com/300x200?text=Ceramic+Pottery', 4.6, 20),
('Beaded Necklace', 12000.00, 'Handcrafted beaded necklace with unique patterns', 'Jewelry', 'moshie-kekpoti', 'Sarah Membe', 8, 'https://via.placeholder.com/300x200?text=Beaded+Necklace', 4.7, 14);


CREATE DATABASE IF NOT EXISTS local_roots;
USE local_roots;

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hero_image VARCHAR(255),
    vendor_count INT DEFAULT 0,
    product_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    community VARCHAR(50) NOT NULL,
    vendor VARCHAR(255),
    stock INT DEFAULT 0,
    image VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_community (community),
    INDEX idx_category (category),
    INDEX idx_vendor (vendor)
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role ENUM('buyer', 'seller', 'both', 'admin') DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Community stories table
CREATE TABLE IF NOT EXISTS community_stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id INT,
    slug VARCHAR(255) UNIQUE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Insert sample communities
INSERT INTO communities (id, name, description, hero_image, vendor_count, product_count) VALUES
('kendem', 'Kendem', 'Discover unique products and support local artisans.', 'kendem-hero.jpg', 50, 100),
('mamfe', 'Mamfe', 'Discover unique products and support local artisans.', 'mamfe-hero.jpg', 50, 100),
('membe', 'Membe', 'Discover unique products and support local artisans.', 'membe-hero.jpg', 50, 100),
('widikum', 'Widikum', 'Discover unique products and support local artisans.', 'widikum-hero.jpg', 50, 100),
('fonjo', 'Fonjo', 'Discover unique products and support local artisans.', 'fonjo-hero.jpg', 50, 100),
('moshie-kekpoti', 'Moshie/Kekpoti', 'Discover unique products and support local artisans.', 'moshie-kekpoti-hero.png', 50, 100);

-- Insert sample products
INSERT INTO products (name, price, description, category, community, vendor, stock, image, rating, reviews) VALUES
('Handwoven Basket', 15000.00, 'Beautiful handwoven basket made from local materials', 'Crafts', 'kendem', 'Marie Nguema', 10, 'https://via.placeholder.com/300x200?text=Handwoven+Basket', 4.5, 12),
('Fresh Cocoa Beans', 8000.00, 'Premium quality cocoa beans from local farms', 'Food', 'mamfe', 'Farm Fresh', 25, 'https://via.placeholder.com/300x200?text=Fresh+Cocoa+Beans', 4.8, 8),
('Wooden Carving', 25000.00, 'Intricate wooden carving representing local culture', 'Crafts', 'membe', 'Master Craftsman', 5, 'https://via.placeholder.com/300x200?text=Wooden+Carving', 4.9, 15),
('Palm Oil', 5000.00, 'Pure, unrefined palm oil from local producers', 'Food', 'widikum', 'Oil Producers Coop', 50, 'https://via.placeholder.com/300x200?text=Palm+Oil', 4.3, 20),
('Ceramic Pottery', 18000.00, 'Beautiful ceramic pottery with traditional designs', 'Crafts', 'fonjo', 'Grace Moshie', 12, 'https://via.placeholder.com/300x200?text=Ceramic+Pottery', 4.6, 20),
('Beaded Necklace', 12000.00, 'Handcrafted beaded necklace with unique patterns', 'Jewelry', 'moshie-kekpoti', 'Sarah Membe', 8, 'https://via.placeholder.com/300x200?text=Beaded+Necklace', 4.7, 14);
