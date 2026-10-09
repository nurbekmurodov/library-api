const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./library.db", (err) => {
  if (err) {
    console.log("Database error:", err.message);
  } else {
    console.log("SQLite database connected");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER,
      category TEXT,
      available INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS borrowings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER,
      user_id INTEGER,
      borrowed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      returned_at TEXT,
      FOREIGN KEY(book_id) REFERENCES books(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
