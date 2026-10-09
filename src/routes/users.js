const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/users — Barcha foydalanuvchilarni olish
router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /api/users — Yangi foydalanuvchi qo'shish
router.post("/", (req, res) => {
  const { name, phone } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name majburiy" });
  }

  db.run(
    "INSERT INTO users (name, phone) VALUES (?, ?)",
    [name, phone],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        name,
        phone
      });
    }
  );
});

// DELETE /api/users/:id — Foydalanuvchini o'chirish
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.json({ message: "Foydalanuvchi o'chirildi" });
  });
});

module.exports = router;
