const express = require("express");
const Cart = require("../models/Cart");
const Painting = require("../models/Painting");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Получить корзину пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.paintingId"
    );
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения корзины", error });
  }
});

// Добавить товар в корзину
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { paintingId } = req.body;

    if (!paintingId) {
      return res.status(400).json({ message: "paintingId is required" });
    }

    const painting = await Painting.findById(paintingId);
    
    if (!painting) {
      return res.status(404).json({ message: "Картина не найдена" });
    }

    if (painting.sold) {
      return res.status(400).json({ message: "Эта картина уже продана" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [{ paintingId }] });
    } else {
      const item = cart.items.find((i) => i.paintingId.toString() === paintingId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ paintingId });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Ошибка добавления в корзину", error });
  }
});

// Удалить товар из корзины
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { paintingId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.paintingId.toString() !== paintingId
      );
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления из корзины", error });
  }
});

module.exports = router;
