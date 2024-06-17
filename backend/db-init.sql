CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(32) NOT NULL UNIQUE CHECK (email <> ''),
  password_hash BYTEA NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE couriers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone_number VARCHAR(32),
  car_number VARCHAR(16),
  status VARCHAR(16) NOT NULL DEFAULT 'free',
  notes VARCHAR(256)
);

CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone_number VARCHAR(32),
  notes VARCHAR(256)
);

CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  quantity INTEGER NOT NULL,
  cost REAL NOT NULL,
  last_supply_date TIMESTAMP
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  courier_id BIGINT REFERENCES couriers (id) ON DELETE SET NULL,
  client_id BIGINT REFERENCES clients (id) ON DELETE SET NULL,
  address_from VARCHAR(256) NOT NULL,
  address_to VARCHAR(256) NOT NULL,
  notes VARCHAR(256),
  status VARCHAR(16) NOT NULL DEFAULT 'not_ready',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  deliver_to TIMESTAMP NOT NULL,
  delivered_at TIMESTAMP,
  items JSONB NOT NULL,
  delivery_cost REAL NOT NULL,
  total_cost REAL NOT NULL
);
