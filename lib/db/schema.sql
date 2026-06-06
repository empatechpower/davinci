-- DaVinci Project — PostgreSQL schema for Supabase
-- Run in the Supabase SQL editor or via psql

CREATE TABLE IF NOT EXISTS users (
  id            UUID         NOT NULL DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name     VARCHAR(255),
  phone         VARCHAR(50),
  address       TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS artists (
  id              UUID         NOT NULL DEFAULT gen_random_uuid(),
  slug            VARCHAR(255) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  category        VARCHAR(100),
  tagline         TEXT,
  short_bio       TEXT,
  full_bio        TEXT,
  medium          VARCHAR(100),
  image_url       TEXT,
  cover_image_url TEXT,
  sold_count      INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS artworks (
  id              UUID          NOT NULL DEFAULT gen_random_uuid(),
  slug            VARCHAR(255)  NOT NULL UNIQUE,
  artist_id       UUID,
  title           VARCHAR(255)  NOT NULL,
  category        VARCHAR(100),
  price           NUMERIC(10,2),
  artist_receives NUMERIC(10,2),
  description     TEXT,
  technique       TEXT,
  dimensions      VARCHAR(100),
  story           TEXT,
  inspiration     TEXT,
  artist_quote    TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id                 UUID         NOT NULL DEFAULT gen_random_uuid(),
  slug               VARCHAR(255) NOT NULL UNIQUE,
  title              VARCHAR(255) NOT NULL,
  date               DATE,
  time               TIME,
  location           VARCHAR(255),
  category           VARCHAR(100),
  status             VARCHAR(50)  NOT NULL DEFAULT 'upcoming',
  featured           BOOLEAN      NOT NULL DEFAULT FALSE,
  expected_attendees INT,
  description        TEXT,
  long_description   TEXT,
  admission          VARCHAR(100),
  image_url          TEXT,
  thumbnail_url      TEXT,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS orders (
  id               UUID         NOT NULL DEFAULT gen_random_uuid(),
  order_number     VARCHAR(50)  NOT NULL UNIQUE,
  user_id          UUID,
  customer_name    VARCHAR(255),
  customer_email   VARCHAR(255),
  total            NUMERIC(10,2),
  status           VARCHAR(50)  NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  payment_method   VARCHAR(100),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id            UUID         NOT NULL DEFAULT gen_random_uuid(),
  order_id      UUID         NOT NULL,
  artwork_id    UUID,
  artwork_title VARCHAR(255),
  artist_name   VARCHAR(255),
  quantity      INT          NOT NULL DEFAULT 1,
  price         NUMERIC(10,2),
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id                   UUID        NOT NULL DEFAULT gen_random_uuid(),
  event_id             UUID        NOT NULL,
  user_id              UUID,
  name                 VARCHAR(255),
  email                VARCHAR(255),
  phone                VARCHAR(50),
  attendee_count       INT         NOT NULL DEFAULT 1,
  dietary_restrictions TEXT,
  special_requirements TEXT,
  registered_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE SET NULL
);
