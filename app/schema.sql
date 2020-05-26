CREATE TABLE user (
  sub TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  refresh_token TEXT
);