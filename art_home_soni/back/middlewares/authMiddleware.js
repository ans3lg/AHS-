const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет доступа (токен отсутствует или неверный формат)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Доступ запрещен" });
  }
  next();
};

exports.artistMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role !== "artist" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Доступ только для художников" });
  }
  next();
};
