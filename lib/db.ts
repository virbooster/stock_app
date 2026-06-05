const Database = require('better-sqlite3');
const db = new Database('dev.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
  CREATE TABLE IF NOT EXISTS Product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0,
    isDeleted INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
    updatedAt TEXT DEFAULT (DATETIME('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS Movement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    reason TEXT,
    createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
    FOREIGN KEY (productId) REFERENCES Product(id)
  );
`);

export { db };
