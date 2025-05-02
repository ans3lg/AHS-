const multer = require("multer");
const path = require("path");

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Файлы будут сохраняться в папку uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерируем уникальное имя
  },
});

// Фильтр для изображений
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Допустимы только изображения форматов JPEG, PNG и WEBP"), false);
  }
};

// Настройка Multer
const upload = multer({ storage, fileFilter });

module.exports = { upload };
