const express = require("express");
const { register, login, getProfile, updateProfile, changePassword } = require("../controllers/authController");
const { check } = require("express-validator");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Имя обязательно").not().isEmpty(),
    check("email", "Введите корректный email").isEmail(),
    check("phone", "Введите корректный номер телефона").isMobilePhone(),
    check("password", "Пароль должен быть минимум 6 символов").isLength({ min: 6 }),
  ],
  register
);
router.post("/login", login);

// Маршрут получения профиля
router.get("/profile", authMiddleware, getProfile);

// Новый маршрут для обновления профиля
router.put("/profile", authMiddleware, updateProfile);

// Новый маршрут для смены пароля
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;