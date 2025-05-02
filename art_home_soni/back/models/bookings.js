const express = require("express");
const Booking = require("../models/Booking");
const Masterclass = require("../models/Masterclass");
const router = express.Router();

// Создание бронирования
router.post("/", async (req, res) => {
  try {
    const { name, email, masterclassId } = req.body;

    const masterclass = await Masterclass.findById(masterclassId);
    if (!masterclass) return res.status(404).json({ message: "Мастер-класс не найден" });

    if (masterclass.seats <= 0) return res.status(400).json({ message: "Нет свободных мест" });

    const booking = new Booking({ name, email, masterclassId });
    await booking.save();

    // Уменьшаем количество мест
    masterclass.seats -= 1;
    await masterclass.save();

    res.status(201).json({ message: "Вы успешно записались!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

module.exports = router;
