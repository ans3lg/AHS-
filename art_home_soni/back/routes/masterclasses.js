const express = require("express");
const Masterclass = require("../models/Masterclass");
const Booking = require("../models/Booking"); // Подключаем модель заявок
const router = express.Router();

// Получение мастер-класса с информацией о свободных местах
router.get("/:id", async (req, res) => {
  try {
    const masterclass = await Masterclass.findById(req.params.id);
    if (!masterclass) {
      return res.status(404).json({ message: "Мастер-класс не найден" });
    }

    // Подсчитываем количество заявок, влияющих на доступные места
    const bookedCount = await Booking.countDocuments({
      masterclassId: masterclass._id,
      status: { $in: ["ожидание подтверждения", "оплачено"] }
    });

    // Вычисляем доступные места
    const availableSeats = masterclass.seats - bookedCount;

    // Формируем ответ с добавленным полем availableSeats
    const masterclassWithAvailability = {
      ...masterclass.toObject(),
      availableSeats
    };

    res.status(200).json(masterclassWithAvailability);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

// Остальные маршруты остаются без изменений
router.post("/", async (req, res) => {
  try {
    const masterclass = new Masterclass(req.body);
    await masterclass.save();
    res.status(201).json({ message: "Мастер-класс добавлен", masterclass });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const masterclasses = await Masterclass.find().sort({ createdAt: -1 });

    const enrichedMasterclasses = await Promise.all(
      masterclasses.map(async (mc) => {
        const bookedCount = await Booking.countDocuments({
          masterclassId: mc._id,
          status: { $in: ["ожидание подтверждения", "оплачено"] },
        });

        const availableSeats = mc.seats - bookedCount;

        return {
          ...mc.toObject(),
          availableSeats,
        };
      })
    );

    res.status(200).json(enrichedMasterclasses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении", error });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedMasterclass = await Masterclass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Мастер-класс обновлен", updatedMasterclass });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Masterclass.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Мастер-класс удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении", error });
  }
});

module.exports = router;
