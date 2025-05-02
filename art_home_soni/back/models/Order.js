const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      paintingId: { type: mongoose.Schema.Types.ObjectId, ref: "Painting", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  customerInfo: {
    firstName: String,
    lastName: String,
    phone: String,
    telegram: String,
    address: String,
    postalCode: String,
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
