import { useEffect, useState } from "react";
import "./BookingsPage.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      } else {
        console.error("Ошибка при получении заявок:", data.message);
      }
    } catch (error) {
      console.error("Ошибка сервера", error);
    }
  };

  return (
    <div className="bookings-page">
      <h2 className="page-title">Мои заявки на мастер-классы</h2>
      {bookings.length === 0 ? (
        <p className="empty-message">Нет заявок.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p><span className="label">Имя пользователя:</span> {booking.user?.name}</p>
              <p><span className="label">Email:</span> {booking.user?.email}</p>
              <p><span className="label">Мастер-класс:</span> {booking.masterclassId?.title}</p>
              <p><span className="label">Дата заявки:</span> {new Date(booking.createdAt).toLocaleString()}</p>
              <p><span className="label">Статус:</span> <span className={`status ${booking.status}`}>{booking.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
