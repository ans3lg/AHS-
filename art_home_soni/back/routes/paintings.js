const express = require("express");
const Painting = require("../models/Painting");
const router = express.Router();

// Добавление картины
router.post("/", async (req, res) => {
  try {
    const painting = new Painting(req.body);
    await painting.save();
    res.status(201).json({ message: "Картина добавлена", painting });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении", error });
  }
});

// Получение всех картин
router.get("/", async (req, res) => {
  try {
    const paintings = await Painting.find().sort({ createdAt: -1 });
    res.json(paintings);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении", error });
  }
});

// Редактирование картины
router.put("/:id", async (req, res) => {
  try {
    const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Картина обновлена", painting });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении", error });
  }
});

// Удаление картины
router.delete("/:id", async (req, res) => {
  try {
    await Painting.findByIdAndDelete(req.params.id);
    res.json({ message: "Картина удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      return res.status(404).json({ message: "Картина не найдена" });
    }
    res.json(painting);
  } catch (error) {
    console.error("Ошибка при получении картины:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
