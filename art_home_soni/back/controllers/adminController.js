const Painting = require("../models/Painting");

exports.addPainting = async (req, res) => {
  try {
    const { title, price, color, description, size, material, orientation } = req.body;

    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: "Главное изображение обязательно" });
    }

    const mainImagePath = req.files.mainImage[0].path;
    const additionalImagesPaths = req.files.additionalImages ? req.files.additionalImages.map(file => file.path) : [];

    const newPainting = new Painting({
      title,
      price,
      color,
      description,
      mainImage: mainImagePath,
      additionalImages: additionalImagesPaths,
      size,
      material,
      orientation,
      artist: req.user.id, // Привязываем картину к пользователю
    });

    await newPainting.save();
    res.status(201).json({ message: "Картина успешно добавлена" });
  } catch (error) {
    console.error("Ошибка при добавлении картины:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Функция редактирования картины
exports.updatePainting = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Если пришли новые файлы – обновляем пути к изображениям
    if (req.files && req.files.mainImage) {
      updateData.mainImage = req.files.mainImage[0].path;
    }
    if (req.files && req.files.additionalImages) {
      updateData.additionalImages = req.files.additionalImages.map(file => file.path);
    }

    const updated = await Painting.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Картина не найдена" });

    res.json({ message: "Картина обновлена", painting: updated });
  } catch (error) {
    console.error("Ошибка при обновлении картины:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Функция удаления картины
exports.deletePainting = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Painting.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Картина не найдена" });
    res.json({ message: "Картина удалена" });
  } catch (error) {
    console.error("Ошибка при удалении картины:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
