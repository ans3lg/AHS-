const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  masterclassId: { type: mongoose.Schema.Types.ObjectId, ref: "Masterclass", required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["ожидание подтверждения", "оплачено", "отклонено"], 
    default: "ожидание подтверждения" 
  },
},
{
  timestamps: true // 🔥 добавит createdAt и updatedAt автоматически
});

module.exports = mongoose.model("Booking", BookingSchema);
