const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;  // Токен бота
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;  // Чат админа

const router = express.Router();

// Создание бронирования
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { masterclassId } = req.body;

    if (!masterclassId) {
      return res.status(400).json({ message: "masterclassId обязателен" });
    }

    if (!mongoose.Types.ObjectId.isValid(masterclassId)) {
      return res.status(400).json({ message: "Неверный формат masterclassId" });
    }

    // Проверяем, есть ли уже активная бронь
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      masterclassId: masterclassId,
      status: { $in: ["ожидание подтверждения", "оплачено"] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Вы уже записаны на этот мастер-класс" });
    }

    const booking = new Booking({
      user: req.user.id,
      masterclassId: new mongoose.Types.ObjectId(masterclassId),
      email: req.user.email,
      name: req.user.name,
    });

    await booking.save();

    // 📢 Отправляем уведомление в Telegram
    const message = `🆕 *Новое бронирование!*\n👤 *Имя:* ${req.user.name}\n📧 *Email:* ${req.user.email}\n🎟️ *Мастер-класс ID:* ${masterclassId}\n⏳ *Статус:* Ожидание подтверждения`;
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    res.status(201).json({ message: "Бронирование отправлено на подтверждение" });
  } catch (error) {
    console.error("❌ Ошибка бронирования:", error);
    res.status(500).json({ message: "Заявка оставлена" });
  }
});


// Получение всех бронирований (если нужно)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("masterclassId")
      .populate("user")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Ошибка получения бронирований:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
