// routes/profile.js
const express = require('express');
const router = express.Router();

// Пример маршрута для получения информации о профиле пользователя
router.get('/', (req, res) => {
  // Логика получения данных профиля
  res.json({ message: 'Профиль пользователя' });
});

module.exports = router;
