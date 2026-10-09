const express = require("express");
const cors = require("cors");

require("./db");

const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Library API ishlayapti",
    endpoints: {
      books: {
        "GET /api/books": "Barcha kitoblarni olish",
        "GET /api/books/:id": "Bitta kitobni olish",
        "GET /api/books/search?title=...": "Kitob nomi bo'yicha qidirish",
        "GET /api/books/filter?category=...": "Kategoriya bo'yicha filter",
        "GET /api/books/available": "Faqat mavjud kitoblar",
        "POST /api/books": "Yangi kitob qo'shish",
        "PUT /api/books/:id": "Kitobni yangilash",
        "DELETE /api/books/:id": "Kitobni o'chirish"
      },
      users: {
        "GET /api/users": "Barcha foydalanuvchilarni olish",
        "POST /api/users": "Yangi foydalanuvchi qo'shish",
        "DELETE /api/users/:id": "Foydalanuvchini o'chirish"
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server http://localhost:3000 da ishlayapti");
});
