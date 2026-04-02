CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  court_id     TEXT NOT NULL,
  court_name   TEXT NOT NULL,
  slot_id      TEXT NOT NULL,
  slot_time    TEXT NOT NULL,
  booking_date DATE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents two users booking the same slot on the same date
  CONSTRAINT unique_slot_per_date UNIQUE (court_id, slot_id, booking_date)
);
