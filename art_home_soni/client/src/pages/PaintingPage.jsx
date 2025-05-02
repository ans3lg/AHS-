import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PaintingPage.css";

const PaintingPage = ({ addToCart }) => {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/paintings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPainting(data);
        // Устанавливаем первое изображение (главное) по умолчанию
        setSelectedImage(data.mainImage);
      })
      .catch((err) => console.error("Ошибка загрузки картины:", err));
  }, [id]);

  if (!painting) {
    return <p>Загрузка...</p>;
  }

  const BASE_URL = "http://localhost:5000";
  // Формируем массив изображений: главное + дополнительные
  const images = [painting.mainImage, ...painting.additionalImages];

  return (
    <div className="PaintingPage">
      <h1>{painting.title}</h1>
      <div className="painting-container">
        <div className="image-container">
          <img
            src={`${BASE_URL}/${selectedImage}`}
            alt={painting.title}
            className="main-image"
          />
          <div className="gallery">
            {images.map((img, index) => (
              <img
                key={index}
                src={`${BASE_URL}/${img}`}
                alt={`Доп. фото ${index + 1}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="painting-info">
          <p className="price">Цена: {painting.price} руб.</p>
          <p className="description">{painting.description}</p>
          <p>
            <strong>Материал:</strong> {painting.material}
          </p>
          <p>
            <strong>Размер:</strong> {painting.size}
          </p>
          <p>
            <strong>Ориентация:</strong> {painting.orientation}
          </p>
          <button onClick={() => addToCart(painting)} className="add-to-cart">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaintingPage;
