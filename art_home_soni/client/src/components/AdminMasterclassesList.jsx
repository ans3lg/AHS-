import { useEffect, useState } from "react";
import Modal from "react-modal";

const AdminMasterclassesList = () => {
  const [masterclasses, setMasterclasses] = useState([]);
  const [filteredMasterclasses, setFilteredMasterclasses] = useState([]);
  const [editingMasterclass, setEditingMasterclass] = useState(null);
  const [formData, setFormData] = useState(null);
  const [dateError, setDateError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [masterclassToDelete, setMasterclassToDelete] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    format: "",
    minPrice: "",
    maxPrice: "",
    minDate: "",
    maxDate: "",
    minSeats: "",
    maxSeats: "",
  });
  const token = localStorage.getItem("token");

  const fetchMasterclasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/masterclasses");
      let data = await res.json();
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMasterclasses(data);
      setFilteredMasterclasses(data);
    } catch (error) {
      console.error("Ошибка загрузки мастер-классов:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      format: "",
      minPrice: "",
      maxPrice: "",
      minDate: "",
      maxDate: "",
      minSeats: "",
      maxSeats: "",
    });
  };

  useEffect(() => {
    fetchMasterclasses();
  }, []);

  useEffect(() => {
    // Применение фильтров
    let filtered = masterclasses;

    if (filters.searchQuery) {
      filtered = filtered.filter((mc) =>
        mc.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    if (filters.format) {
      filtered = filtered.filter((mc) => mc.format === filters.format);
    }
    if (filters.minPrice) {
      filtered = filtered.filter((mc) => mc.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((mc) => mc.price <= Number(filters.maxPrice));
    }
    if (filters.minDate) {
      filtered = filtered.filter(
        (mc) => new Date(mc.date) >= new Date(filters.minDate)
      );
    }
    if (filters.maxDate) {
      filtered = filtered.filter(
        (mc) => new Date(mc.date) <= new Date(filters.maxDate)
      );
    }
    if (filters.minSeats) {
      filtered = filtered.filter((mc) => mc.seats >= Number(filters.minSeats));
    }
    if (filters.maxSeats) {
      filtered = filtered.filter((mc) => mc.seats <= Number(filters.maxSeats));
    }

    setFilteredMasterclasses(filtered);
  }, [filters, masterclasses]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/masterclass/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      alert(result.message);
      fetchMasterclasses();
    } catch (error) {
      console.error("Ошибка удаления мастер-класса:", error);
    }
  };

  const handleEdit = (masterclass) => {
    setEditingMasterclass(masterclass);
    const formattedDate = masterclass.date ? masterclass.date.slice(0, 16) : "";
    setFormData({
      title: masterclass.title,
      description: masterclass.description,
      format: masterclass.format,
      date: formattedDate,
      price: masterclass.price,
      seats: masterclass.seats,
    });
    setDateError("");
    setModalIsOpen(true);
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (dateError) {
      alert("Исправьте ошибку с датой перед отправкой формы");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/masterclass/${editingMasterclass._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      alert(result.message);
      setModalIsOpen(false);
      setEditingMasterclass(null);
      fetchMasterclasses();
    } catch (error) {
      console.error("Ошибка обновления мастер-класса:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="admin_list_container">
      <h2 className="admin_h">Управление мастер-классами</h2>
      <div className="admin_list_filters">
        <input
          type="text"
          name="searchQuery"
          placeholder="Поиск по названию"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <select
          name="format"
          value={filters.format}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        >
          <option value="">Все форматы</option>
          <option value="онлайн">Онлайн</option>
          <option value="вживую">Вживую</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Мин. цена"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Макс. цена"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="date"
          name="minDate"
          placeholder="Мин. дата"
          value={filters.minDate}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="date"
          name="maxDate"
          placeholder="Макс. дата"
          value={filters.maxDate}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="number"
          name="minSeats"
          placeholder="Мин. мест"
          value={filters.minSeats}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="number"
          name="maxSeats"
          placeholder="Макс. мест"
          value={filters.maxSeats}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <button className="admin_list_button" onClick={resetFilters}>
          Очистить фильтры
        </button>
      </div>
      {filteredMasterclasses.length === 0 ? (
        <p>Нет добавленных мастер-классов</p>
      ) : (
        <div className="admin_list_cardContainer">
          {filteredMasterclasses.map((mc) => (
            <div key={mc._id} className="admin_list_card">
              <div className="admin_list_text">
                <h3 className="admin_masterklass_cardTitle admin_list_cardTitle">
                  {mc.title}
                </h3>
                <p>
                  <strong>Описание:</strong> {mc.description}
                </p>
                <p>
                  <strong>Формат:</strong> {mc.format}
                </p>
                <p>
                  <strong>Дата:</strong> {new Date(mc.date).toLocaleString()}
                </p>
                <p>
                  <strong>Цена:</strong> {mc.price}
                </p>
                <p>
                  <strong>Дата добавления:</strong>{" "}
                  {new Date(mc.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Количество мест:</strong> {mc.seats}
                </p>
                <div className="admin_list_buttonContainer">
                  <button
                    className="admin_list_button"
                    onClick={() => handleEdit(mc)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="admin_list_button"
                    onClick={() => {
                      setMasterclassToDelete(mc._id);
                      setDeleteConfirmModalOpen(true);
                    }}
                  >
                    Удалить
                  </button>
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
        <h3>Редактирование мастер-класса: {editingMasterclass?.title}</h3>
        <form onSubmit={handleUpdate} className="admin_list_form">
          <input
            type="text"
            name="title"
            value={formData?.title}
            onChange={handleChange}
            placeholder="Название"
            required
            className="admin_list_input"
          />
          <textarea
            name="description"
            value={formData?.description}
            onChange={handleChange}
            placeholder="Описание"
            required
            className="admin_list_textarea"
          ></textarea>
          <select
            name="format"
            value={formData?.format}
            onChange={handleChange}
            className="admin_list_input"
          >
            <option value="онлайн">Онлайн</option>
            <option value="вживую">Вживую</option>
          </select>
          <input
            type="datetime-local"
            name="date"
            value={formData?.date}
            onChange={handleChange}
            required
            className="admin_list_input"
          />
          {dateError && <p className="admin_list_error">{dateError}</p>}
          <input
            type="number"
            name="price"
            value={formData?.price}
            onChange={handleChange}
            placeholder="Цена"
            required
            className="admin_list_input"
          />
          <input
            type="number"
            name="seats"
            value={formData?.seats}
            onChange={handleChange}
            placeholder="Количество мест"
            required
            className="admin_list_input"
          />
          <button
            type="submit"
            className="admin_list_button admin_list_button_one"
            disabled={!!dateError}
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            onClick={() => setModalIsOpen(false)}
            className="admin_list_button"
          >
            Отмена
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={deleteConfirmModalOpen}
        onRequestClose={() => setDeleteConfirmModalOpen(false)}
        className="admin_list_modal"
      >
        <h3>Вы уверены, что хотите удалить этот мастер-класс?</h3>
        <div className="admin_list_buttonContainer">
          <button
            className="admin_list_button admin_list_button_one"
            onClick={() => {
              handleDelete(masterclassToDelete);
              setDeleteConfirmModalOpen(false);
            }}
          >
            Да, удалить
          </button>
          <button
            className="admin_list_button"
            onClick={() => setDeleteConfirmModalOpen(false)}
          >
            Отмена
          </button>
        </div>
      </Modal> 
    </div>
  );
};

export default AdminMasterclassesList;
