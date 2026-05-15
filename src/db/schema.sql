-- Museum Shop Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins (muzey xodimlari va sotuvchilar)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  telegram_id BIGINT UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'seller')),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Museums
CREATE TABLE IF NOT EXISTS museums (
  id VARCHAR(50) PRIMARY KEY,
  region VARCHAR(50),
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Museum translations
CREATE TABLE IF NOT EXISTS museum_translations (
  museum_id VARCHAR(50) REFERENCES museums(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL CHECK (lang IN ('uz', 'ru', 'en')),
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100),
  short TEXT,
  description TEXT,
  PRIMARY KEY (museum_id, lang)
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  type VARCHAR(30) NOT NULL CHECK (type IN ('MOHIR_QOLLAR', 'MUZEY_SUVENIRLARI')),
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  museum_id VARCHAR(50) REFERENCES museums(id),
  maker VARCHAR(100),
  dimensions VARCHAR(50),
  in_stock BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product translations
CREATE TABLE IF NOT EXISTS product_translations (
  product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL CHECK (lang IN ('uz', 'ru', 'en')),
  name VARCHAR(200) NOT NULL,
  short TEXT,
  description TEXT,
  PRIMARY KEY (product_id, lang)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20) NOT NULL,
  delivery_method VARCHAR(20) CHECK (delivery_method IN ('standard', 'express', 'pickup')),
  address TEXT,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) REFERENCES products(id),
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL
);

-- Users (mijozlar)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_museum ON products(museum_id);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
