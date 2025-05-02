const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Проверка, есть ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email уже зарегистрирован" });

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Неверные учетные данные" });

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    // Генерация токена
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,      // Добавляем имя
        email: user.email,    // Добавляем email
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Исключаем пароль

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Обновление данных профиля
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password"); // исключаем пароль из ответа

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Смена пароля
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный текущий пароль" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Пароль успешно изменён" });
  } catch (error) {
    console.error("Ошибка смены пароля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};