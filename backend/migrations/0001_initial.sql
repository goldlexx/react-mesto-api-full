CREATE TABLE users (
  _id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  about TEXT NOT NULL,
  avatar TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE cards (
  _id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  owner TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE TABLE card_likes (
  card_id TEXT NOT NULL REFERENCES cards(_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, user_id)
);

CREATE INDEX cards_created_at_idx ON cards(created_at DESC);
CREATE INDEX card_likes_user_idx ON card_likes(user_id);
