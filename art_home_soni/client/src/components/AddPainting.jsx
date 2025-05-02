import { useState } from "react";
import ArtistPanel from "../pages/ArtistPanel";
import "./AddPainting.css"

const AddPainting = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    color: "",
    description: "",
    size: "",
    material: "",
    orientation: "",
    mainImage: null,
    additionalImages: [],
  });

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (e.target.name === "mainImage") {
      setFormData({ ...formData, mainImage: files });
      setMainImagePreview(
        files.length > 0 ? URL.createObjectURL(files[0]) : null
      );
    } else if (e.target.name === "additionalImages") {
      setFormData({ ...formData, additionalImages: files });
      setAdditionalImagesPreview(
        files.map((file) => URL.createObjectURL(file))
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("color", formData.color);
    data.append("description", formData.description);
    data.append("size", formData.size);
    data.append("material", formData.material);
    data.append("orientation", formData.orientation);

    if (formData.mainImage && formData.mainImage.length > 0) {
      data.append("mainImage", formData.mainImage[0]);
    }

    if (formData.additionalImages && formData.additionalImages.length > 0) {
      formData.additionalImages.forEach((image) =>
        data.append("additionalImages", image)
      );
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/add-painting",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: data,
        }
      );

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Ошибка при добавлении картины:", error);
    }
  };

  return (
    <div className="artist_add_painting">
      <ArtistPanel />
      <h2 className="artist_h">
        Добавить картину
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="artist_form_group">
          <input
            type="text"
            name="title"
            placeholder="Название"
            onChange={handleChange}
            required
            className="artist_input"
          />
          <input
            type="number"
            name="price"
            placeholder="Цена"
            onChange={handleChange}
            required
            className="artist_input"
          />
          <input
            type="text"
            name="color"
            placeholder="Цвет"
            onChange={handleChange}
            className="artist_input"
          />
          <input
            type="text"
            name="description"
            placeholder="Описание"
            onChange={handleChange}
            className="artist_input"
          />
          <input
            type="text"
            name="size"
            placeholder="Размер"
            onChange={handleChange}
            className="artist_input"
          />
          <input
            type="text"
            name="material"
            placeholder="Материал"
            onChange={handleChange}
            className="artist_input"
          />
          <input
            type="text"
            name="orientation"
            placeholder="Ориентация"
            onChange={handleChange}
            className="artist_input"
          />

          <label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {mainImagePreview && (
              <div className="image-preview">
                <img
                  src={mainImagePreview}
                  alt="Главное изображение"
                  width="100"
                />
              </div>
            )}
          </label>

          <label>
            <input
              type="file"
              name="additionalImages"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="image-preview">
              {additionalImagesPreview.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Доп. изображение ${index}`}
                  width="100"
                />
              ))}
            </div>
          </label>

          <button type="submit" className="artist_button">Добавить картину</button>
        </div>
      </form>
    </div>
  );
};

export default AddPainting;
