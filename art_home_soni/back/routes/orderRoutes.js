const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Painting = require("../models/Painting");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, telegram, address, postalCode, cart } =
      req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Корзина пуста" });
    }

    // Получаем ID всех товаров в корзине
    const paintingIds = cart.map((item) => item.paintingId._id);

    // Проверяем, есть ли среди них уже проданные
    const soldPaintings = await Painting.find({
      _id: { $in: paintingIds },
      sold: true,
    });

    if (soldPaintings.length > 0) {
      return res.status(400).json({
        message:
          "Некоторые товары уже были куплены другим пользователем. Обновите корзину.",
      });
    }

    // Подсчет общей суммы
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.paintingId.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items: cart,
      totalPrice,
      customerInfo: {
        firstName,
        lastName,
        phone,
        telegram,
        address,
        postalCode,
      },
    });

    await order.save();

    // Обновляем статус картин
    await Painting.updateMany(
      { _id: { $in: paintingIds } },
      { $set: { sold: true } }
    );

    // Удаляем корзину пользователя
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({ message: "Заказ оформлен!", order });
  } catch (error) {
    res.status(500).json({ message: "Ошибка оформления заказа", error });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.paintingId");
    res.json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("items.paintingId");

    res.json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Отчетность

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Формируем фильтр по дате
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const orders = await Order.find(filter);

    if (!orders.length) {
      return res.json({ totalSales: 0, totalOrders: 0, monthlySales: [] });
    }

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

    // Группировка по месяцам
    const monthlySales = Array(12).fill(0);
    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlySales[month] += order.totalPrice;
    });

    res.json({ totalSales, totalOrders, monthlySales });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


module.exports = router;
