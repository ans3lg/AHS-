const Masterclass = require("../models/Masterclass");
const Booking = require("../models/Booking");

exports.addMasterclass = async (req, res) => {
  try {
    const { title, description, format, date, price, seats } = req.body;

    if (!title || !description || !format || !date || !price || !seats) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    // Проверяем, что дата не находится в прошлом
    const inputDate = new Date(date);
    const now = new Date();
    if (inputDate < now) {
      return res.status(400).json({ message: "Нельзя создать мастер-класс в прошедшем времени" });
    }

    const newMasterclass = new Masterclass({
      title,
      description,
      format,
      date,
      price,
      seats,
    });

    await newMasterclass.save();
    res.status(201).json({ message: "Мастер-класс успешно добавлен" });
  } catch (error) {
    console.error("Ошибка при добавлении мастер-класса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Функция редактирования мастер-класса
exports.updateMasterclass = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Masterclass.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Мастер-класс не найден" });
    res.json({ message: "Мастер-класс обновлен", masterclass: updated });
  } catch (error) {
    console.error("Ошибка при обновлении мастер-класса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Функция удаления мастер-класса (если на него нет бронирований)
exports.deleteMasterclass = async (req, res) => {
  try {
    const { id } = req.params;
    // Проверка наличия активных бронирований
    const existingBooking = await Booking.findOne({
      masterclassId: id,
      status: { $in: ["ожидание подтверждения", "оплачено"] }
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Нельзя удалить мастер-класс с активными записями" });
    }
    await Masterclass.findByIdAndDelete(id);
    res.json({ message: "Мастер-класс удален" });
  } catch (error) {
    console.error("Ошибка при удалении мастер-класса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение всех мастер-классов с подсчетом свободных мест
exports.getAllMasterclasses = async (req, res) => {
  try {
    const masterclasses = await Masterclass.find();

    const enrichedMasterclasses = await Promise.all(
      masterclasses.map(async (mc) => {
        const bookings = await Booking.find({ masterclassId: mc._id });
        const bookedSeats = bookings.length;
        const availableSeats = mc.seats - bookedSeats;

        return {
          ...mc.toObject(),
          availableSeats,
        };
      })
    );

    res.json(enrichedMasterclasses);
  } catch (error) {
    console.error("Ошибка при получении мастер-классов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
