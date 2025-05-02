const Booking = require("../models/Booking");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Токен бота
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; // Чат админа

// Получение всех бронирований
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user masterclassId").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Ошибка загрузки бронирований:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Обновление статуса бронирования
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ожидание подтверждения", "оплачено", "отклонено"].includes(status)) {
      return res.status(400).json({ message: "Некорректный статус" });
    }

    const booking = await Booking.findById(id).populate("user masterclassId");
    if (!booking) {
      return res.status(404).json({ message: "Бронирование не найдено" });
    }

    booking.status = status;
    await booking.save();

    // 📢 Отправляем уведомление в Telegram при подтверждении оплаты
    if (status === "оплачено") {
      const message = `✅ *Бронирование подтверждено!*\n👤 *Имя:* ${booking.user.name}\n📧 *Email:* ${booking.user.email}\n🎟️ *Мастер-класс:* ${booking.masterclassId?.title || "Не найден"}\n💰 *Статус:* Оплачено`;

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
    }

    res.json({ message: "Статус обновлён", booking });
  } catch (error) {
    console.error("❌ Ошибка обновления статуса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
