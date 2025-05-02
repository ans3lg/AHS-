import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import "./MasterclassPage.css";

const MasterclassPage = () => {
  const { id } = useParams();
  const [masterclass, setMasterclass] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/masterclasses/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setMasterclass(data))
      .catch((err) => console.error("Ошибка загрузки мастер-класса:", err));
  }, [id]);

  if (!masterclass) return <p>Загрузка...</p>;

  return (
    <div className="masterclass-page">
      <h1 className="masterclass-title">{masterclass.title}</h1>
      <div className="content-block">
        <div className="left-block">
          <p className="description">{masterclass.description}</p>
        </div>
        <div className="right-block">
          <div className="info-section">
            <div className="info-item">
              <span className="label">Формат:</span>
              <span className="value">{masterclass.format}</span>
            </div>
            <div className="info-item">
              <span className="label">Дата:</span>
              <span className="value">
                {new Date(masterclass.date).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Цена:</span>
              <span className="value">{masterclass.price} руб.</span>
            </div>
            <div className="info-item">
              <span className="label">Свободных мест:</span>
              <span className="value">{masterclass.availableSeats}</span>
            </div>
          </div>
          <div className="booking-section">
            <BookingForm
              masterclassId={masterclass._id}
              availableSeats={masterclass.availableSeats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterclassPage;
