const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const Booking = require("./models/Booking");
const Masterclass = require("./models/Masterclass");
const Painting = require("./models/Painting");
const User = require("./models/User");

// Токен бота (полученный от BotFather)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// ID чата, куда будут приходить уведомления о бронировании
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; // Укажи свой chat_id в .env

// Хранение chatId пользователей
const userChatIds = {};

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userChatIds[msg.from.id] = chatId; // Запоминаем chatId пользователя
  bot.sendMessage(
    chatId,
    `Привет, ${msg.from.first_name}! 👋 
Я бот онлайн-магазина картин. 
Ты можешь: 
🖼 Заказать картину - /order 
🎨 Забронировать мастер-класс - /book_masterclass`
  );
});

// Оформление заказа
bot.onText(/\/order/, async (msg) => {
  const chatId = msg.chat.id;
  const paintings = await Painting.find(); // Получаем список картин

  if (paintings.length === 0) {
    return bot.sendMessage(chatId, "Пока нет доступных картин.");
  }

  let response = "Доступные картины:\n";
  paintings.forEach((painting, index) => {
    response += `${index + 1}. ${painting.title} - ${painting.price}₽\n`;
  });

  response += "\nВыбери картину, введя её номер:";
  bot.sendMessage(chatId, response);

  bot.once("message", async (responseMsg) => {
    const index = parseInt(responseMsg.text) - 1;
    if (isNaN(index) || index < 0 || index >= paintings.length) {
      return bot.sendMessage(chatId, "Неверный выбор, попробуйте снова.");
    }

    const selectedPainting = paintings[index];
    bot.sendMessage(
      chatId,
      `Вы выбрали "${selectedPainting.title}".\nВведите ваш email для подтверждения заказа:`
    );

    bot.once("message", async (emailMsg) => {
      const email = emailMsg.text;
      const user = await User.findOne({ email });

      if (!user) {
        return bot.sendMessage(chatId, "Пользователь с таким email не найден.");
      }

      bot.sendMessage(chatId, `✅ Заказ оформлен! Мы свяжемся с вами.`);

      // Отправка уведомления в чат с админом
      if (ADMIN_CHAT_ID) {
        bot.sendMessage(
          ADMIN_CHAT_ID,
          `🖼 Новый заказ!\nКартина: ${selectedPainting.title}\nЦена: ${selectedPainting.price}₽\nEmail: ${email}`
        );
      }
    });
  });
});

// Бронирование мастер-класса
bot.onText(/\/book_masterclass/, async (msg) => {
  const chatId = msg.chat.id;
  const masterclasses = await Masterclass.find();

  if (masterclasses.length === 0) {
    return bot.sendMessage(chatId, "Пока нет доступных мастер-классов.");
  }

  let response = "Доступные мастер-классы:\n";
  masterclasses.forEach((mc, index) => {
    response += `${index + 1}. ${mc.title} - ${mc.date.toDateString()} (${mc.price}₽)\n`;
  });
  response += "\nВыбери мастер-класс, введя его номер:";
  bot.sendMessage(chatId, response);

  bot.once("message", async (responseMsg) => {
    const index = parseInt(responseMsg.text) - 1;
    if (isNaN(index) || index < 0 || index >= masterclasses.length) {
      return bot.sendMessage(chatId, "Неверный выбор, попробуйте снова.");
    }

    const selectedMC = masterclasses[index];

    // Считаем заявки, учитывая оба статуса
    const bookedCount = await Booking.countDocuments({ 
      masterclassId: selectedMC._id,
      status: { $in: ["ожидание подтверждения", "оплачено"] }
    });
    const availableSeats = selectedMC.seats - bookedCount;

    if (availableSeats <= 0) {
      return bot.sendMessage(chatId, `😔 На мастер-классе "${selectedMC.title}" нет свободных мест.`);
    }

    // Выводим информацию о доступных местах
    bot.sendMessage(chatId, `На мастер-классе "${selectedMC.title}" доступно ${availableSeats} из ${selectedMC.seats} мест.`);

    bot.sendMessage(chatId, `Введите ваш email для подтверждения бронирования:`);

    bot.once("message", async (emailMsg) => {
      const email = emailMsg.text;
      const user = await User.findOne({ email });

      if (!user) {
        return bot.sendMessage(chatId, "Пользователь с таким email не найден.");
      }

      // Проверяем, существует ли уже заявка от этого пользователя на выбранный мастер-класс
      const existingBooking = await Booking.findOne({
        masterclassId: selectedMC._id,
        user: user._id,
        status: { $in: ["ожидание подтверждения", "оплачено"] }
      });

      if (existingBooking) {
        return bot.sendMessage(
          chatId, 
          `Вы уже отправили заявку на мастер-класс "${selectedMC.title}". Ожидайте подтверждения или оплата уже проведена.`
        );
      }

      // Создаём заявку со статусом "ожидание подтверждения"
      const booking = new Booking({
        user: user._id,
        masterclassId: selectedMC._id,
        email: user.email,
        name: user.name,
        status: "ожидание подтверждения",
      });
      await booking.save();

      bot.sendMessage(chatId, `✅ Ваша заявка принята и ожидает подтверждения администратором.`);

      // Уведомляем администратора
      const adminChatId = process.env.ADMIN_CHAT_ID;
      const adminMessage = `📌 Новая заявка на мастер-класс!
👤 Имя: ${user.name}
📧 Email: ${user.email}
🆔 Telegram ID: ${msg.chat.id}
🎨 Мастер-класс: ${selectedMC.title}
📅 Дата: ${selectedMC.date.toDateString()}
💰 Цена: ${selectedMC.price}₽
Статус: ожидание подтверждения`;
      bot.sendMessage(adminChatId, adminMessage).catch((err) =>
        console.error("Ошибка при отправке админам:", err)
      );
      console.log("Заявка создана и сообщение отправлено админу!");
    });
  });
});





// Функция для отправки уведомлений пользователям
const sendNotification = (userId, message) => {
  const chatId = userChatIds[userId];
  if (chatId) {
    bot.sendMessage(chatId, message);
  }
};

module.exports = { bot, sendNotification };
