import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MasterclassesList.css";

const MasterclassesList = () => {
  const [masterclasses, setMasterclasses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/masterclasses")
      .then((res) => res.json())
      .then((data) => setMasterclasses(data))
      .catch((err) => console.error("Ошибка загрузки мастер-классов:", err));
  }, []);

  return (
    <div className="workshops-page">
      {/* Блок описания */}
      <div className="description-block">
        <h1>Мастер-классы</h1>
        <p>
          Наши мастер-классы — это уникальная возможность погрузиться в мир
          искусства, узнать новые техники и создать свои собственные
          произведения. Выберите подходящий мастер-класс и запишитесь прямо
          сейчас!
        </p>
      </div>

      {/* Список мастер-классов */}
      <div className="workshops-list">
        {masterclasses.map((mc) => (
          <div key={mc._id} className="workshop-card">
            <h2>{mc.title}</h2>
            <p className="description">{mc.description}</p>
            <div className="details">
              <p>
                <strong>Формат:</strong> {mc.format}
              </p>
              <p>
                <strong>Дата:</strong> {new Date(mc.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Цена:</strong> {mc.price}₽
              </p>
              <p>
              <p><strong>Свободные места:</strong> {mc.availableSeats}</p>
              </p>
            </div>
            <Link to={`/masterclass/${mc._id}`} className="sign-up-button">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterclassesList;
