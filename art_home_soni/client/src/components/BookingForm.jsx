// BookingForm.jsx
import { useState } from "react";

const BookingForm = ({ masterclassId, availableSeats }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (availableSeats <= 0) {
      setMessage("Нет свободных мест для бронирования.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ masterclassId }), // возможно, тут нужно добавить userId
      });
  
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Ошибка при бронировании.");
    }
  };
  

  return (
    <div className="booking_masterclass">
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <button type="submit">Забронировать</button>
      </form>
    </div>
  );
};

export default BookingForm;
