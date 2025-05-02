import { useEffect, useState } from "react";
import Modal from "react-modal";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [action, setAction] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Получение списка заявок
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data); // Инициализируем отфильтрованные заявки всеми заявками
    } catch (error) {
      console.error("Ошибка загрузки заявок:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Обновление статуса заявки
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log(result);
      // Обновляем список заявок после изменения статуса
      fetchBookings();
      setModalIsOpen(false);
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  const handleConfirm = (booking, actionType) => {
    setSelectedBooking(booking);
    setAction(actionType);
    setModalIsOpen(true);
  };

  const executeAction = () => {
    if (action === "confirm") {
      updateStatus(selectedBooking._id, "оплачено");
    } else if (action === "reject") {
      updateStatus(selectedBooking._id, "отклонено");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredBookings(
      bookings.filter((booking) =>
        booking.masterclassId?.title.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="admin_list_container">
      <h2 className="admin_h">Заявки на мастер-классы</h2>
      <input
        type="text"
        placeholder="Поиск по названию мастер-класса"
        value={searchQuery}
        onChange={handleSearch}
        className="admin_list_input"
      />
      <button
        className="admin_clear_button"
        onClick={() => {
          setSearchQuery("");
          setFilteredBookings(bookings);
        }}
      >
        Очистить
      </button>
      {Array.isArray(filteredBookings) && filteredBookings.length === 0 ? (
        <p>Нет заявок</p>
      ) : (
        <div className="admin_list_cardContainer">
          {Array.isArray(filteredBookings) &&
            filteredBookings.map((booking) => (
              <div key={booking._id} className="admin_list_card">
                <div className="admin_list_text">
                  <h3 className="admin_list_cardTitle">
                    {booking.masterclassId?.title}
                  </h3>
                  <p>
                    <strong>Имя пользователя:</strong> {booking.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {booking.user?.email}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(booking.masterclassId?.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Цена:</strong> {booking.masterclassId?.price}₽
                  </p>
                  <p>
                    <strong>Статус:</strong> {booking.status}
                  </p>
                  <div className="admin_list_buttonContainer">
                    {booking.status === "ожидание подтверждения" && (
                      <>
                        <button
                          className="admin_list_button"
                          onClick={() => handleConfirm(booking, "confirm")}
                        >
                          Подтвердить
                        </button>
                        <button
                          className="admin_list_button"
                          onClick={() => handleConfirm(booking, "reject")}
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="admin_list_modal"
      >
        <h3>Подтверждение действия</h3>
        <p>
          Вы уверены, что хотите{" "}
          {action === "confirm" ? "подтвердить" : "отклонить"} эту заявку?
        </p>
        <div className="admin_list_buttonContainer">
          <button className="admin_list_button" onClick={executeAction}>
            Да
          </button>
          <button
            className="admin_list_button"
            onClick={() => setModalIsOpen(false)}
          >
            Нет
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
