import { useState } from "react";

const AdminMasterclass = ({ setNotification }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    format: "онлайн",
    date: "",
    price: "",
    seats: "",
  });
  const [dateError, setDateError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const inputDate = new Date(value);
      const now = new Date();
      if (inputDate < now) {
        setDateError("Нельзя выбрать дату в прошедшем времени");
      } else {
        setDateError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateError) return;

    const confirmAdd = window.confirm("Вы уверены, что хотите добавить этот мастер-класс?");
    if (!confirmAdd) return;

    try {
      const response = await fetch("http://localhost:5000/api/admin/add-masterclass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);

      setNotification({ message: "Мастер-класс успешно добавлен!", type: "success" });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Ошибка при добавлении мастер-класса:", error);
      setNotification({ message: "Ошибка при добавлении мастер-класса", type: "error" });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="admin_add_painting">
      <h2 className="admin_h">Добавление мастер-класса</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin_form_group">
          <input
            type="text"
            name="title"
            placeholder="Название"
            onChange={handleChange}
            required
            className="admin_input"
          />
          <textarea
            name="description"
            placeholder="Описание"
            onChange={handleChange}
            required
            className="admin_input"
          ></textarea>

          <select name="format" onChange={handleChange} className="admin_input">
            <option value="онлайн">Онлайн</option>
            <option value="вживую">Вживую</option>
          </select>

          <input
            type="datetime-local"
            name="date"
            onChange={handleChange}
            required
            className="admin_input"
          />
          {dateError && <p style={{ color: "red" }}>{dateError}</p>}

          <input
            type="number"
            name="price"
            placeholder="Цена"
            onChange={handleChange}
            required
            className="admin_input"
          />
          <input
            type="number"
            name="seats"
            placeholder="Количество мест"
            onChange={handleChange}
            required
            className="admin_input"
          />

          <button type="submit" disabled={!!dateError}>
            Добавить мастер-класс
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMasterclass;
