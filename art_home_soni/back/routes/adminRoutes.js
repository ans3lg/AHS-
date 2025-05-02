const express = require("express");
const { addPainting, updatePainting, deletePainting } = require("../controllers/adminController");
const { addMasterclass, updateMasterclass, deleteMasterclass } = require("../controllers/masterclassController");
const { getBookings, updateBookingStatus } = require("../controllers/bookingController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Для картин
router.post("/add-painting", authMiddleware, upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
]), addPainting);

// Редактирование картины
router.put("/painting/:id", authMiddleware, upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
]), updatePainting);

// Удаление картины
router.delete("/painting/:id", authMiddleware, deletePainting);

// Для мастер-классов
router.post("/add-masterclass", authMiddleware, addMasterclass);
router.put("/masterclass/:id", authMiddleware, updateMasterclass);
router.delete("/masterclass/:id", authMiddleware, deleteMasterclass);

// Получение всех заявок
router.get("/bookings", authMiddleware, getBookings);
// Обновление статуса заявки по id
router.put("/bookings/:id", authMiddleware, updateBookingStatus);

module.exports = router;
