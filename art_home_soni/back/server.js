const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const paintingsRoutes = require("./routes/paintings");
const masterclassesRoutes = require("./routes/masterclasses");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/adminRoutes");
// const paintingRoutes = require("./routes/paintingRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const artistRoutes = require("./routes/artistRoutes");

// G O O G L E

const passport = require("passport");
require("./passportConfig");

// 

const app = express();

// Позволяет клиенту получать доступ к файлам в папке "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Здесь __dirname не переопределяется!

// G O O G L E

const session = require("express-session");
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/paintings", paintingsRoutes);
app.use("/api/masterclasses", masterclassesRoutes);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/paintings", paintingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/artist", artistRoutes);

app.use("/api/auth", require("./routes/googleRoutes"));

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB подключена"))
  .catch((err) => console.log("Ошибка подключения к MongoDB:", err));

// Telegram bot
const { bot } = require("./telegramBot");

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
