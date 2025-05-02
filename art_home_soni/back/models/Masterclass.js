const mongoose = require("mongoose");

const masterclassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  format: { type: String, enum: ["онлайн", "вживую"], required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true }, // Количество мест
},
{
  timestamps: true // 🔥 добавит createdAt и updatedAt автоматически
}
);

module.exports = mongoose.model("Masterclass", masterclassSchema);
