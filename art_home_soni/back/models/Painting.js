const mongoose = require("mongoose");

const PaintingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    description: { type: String },
    mainImage: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
    size: { type: String },
    material: { type: String },
    orientation: { type: String },
    sold: { type: Boolean, default: false },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true // 🔥 добавит createdAt и updatedAt автоматически
  }
);

module.exports = mongoose.model("Painting", PaintingSchema);