const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/books — Barcha kitoblarni olish
router.get("/", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/books/available — Faqat mavjud kitoblar (available = 1)
router.get("/available", (req, res) => {
  db.all("SELECT * FROM books WHERE available = 1", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/books/search?title=... — Kitob nomi bo'yicha qidiruv
router.get("/search", (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: "title parametri talab qilinadi" });
  }

  db.all(
    "SELECT * FROM books WHERE title LIKE ?",
    [`%${title}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// GET /api/books/filter?category=... — Category bo'yicha filter
router.get("/filter", (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: "category parametri talab qilinadi" });
  }

  db.all(
    "SELECT * FROM books WHERE category LIKE ?",
    [`%${category}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// GET /api/books/:id — Bitta kitobni ID orqali olish
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Kitob topilmadi" });
    }
    res.json(row);
  });
});

// POST /api/books — Yangi kitob qo'shish
router.post("/", (req, res) => {
  const { title, author, year, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "title va author majburiy" });
  }

  const sql = `
    INSERT INTO books (title, author, year, category)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [title, author, year, category], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      title,
      author,
      year,
      category,
      available: 1
    });
  });
});

// PUT /api/books/:id — Kitobni yangilash
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, year, category, available } = req.body;

  const sql = `
    UPDATE books
    SET title = ?,
        author = ?,
        year = ?,
        category = ?,
        available = ?
    WHERE id = ?
  `;

  db.run(sql, [title, author, year, category, available, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Kitob topilmadi" });
    }
    res.json({ message: "Kitob yangilandi" });
  });
});

// DELETE /api/books/:id — Kitobni o'chirish
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Kitob topilmadi" });
    }
    res.json({ message: "Kitob o'chirildi" });
  });
});

module.exports = router;
