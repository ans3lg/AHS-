import { useEffect, useState } from "react";
import Modal from "react-modal";

const AdminPaintingsList = () => {
  const [paintings, setPaintings] = useState([]);
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [editingPainting, setEditingPainting] = useState(null);
  const [formData, setFormData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [paintingToDelete, setPaintingToDelete] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    description: "",
    size: "",
    material: "",
    orientation: "",
  });
  const token = localStorage.getItem("token");

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      description: "",
      size: "",
      material: "",
      orientation: "",
    });
  };

  const fetchPaintings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/paintings");
      const data = await res.json();
      setPaintings(data);
      setFilteredPaintings(data); // Инициализируем отфильтрованные картины всеми картинами
    } catch (error) {
      console.error("Ошибка загрузки картин:", error);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  useEffect(() => {
    // Применение фильтров
    let filtered = paintings;

    if (filters.searchQuery) {
      filtered = filtered.filter((painting) =>
        painting.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(
        (painting) => painting.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (painting) => painting.price <= Number(filters.maxPrice)
      );
    }
    if (filters.color) {
      filtered = filtered.filter((painting) =>
        painting.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }
    if (filters.description) {
      filtered = filtered.filter((painting) =>
        painting.description
          .toLowerCase()
          .includes(filters.description.toLowerCase())
      );
    }
    if (filters.size) {
      filtered = filtered.filter((painting) =>
        painting.size.toLowerCase().includes(filters.size.toLowerCase())
      );
    }
    if (filters.material) {
      filtered = filtered.filter((painting) =>
        painting.material.toLowerCase().includes(filters.material.toLowerCase())
      );
    }
    if (filters.orientation) {
      filtered = filtered.filter((painting) =>
        painting.orientation
          .toLowerCase()
          .includes(filters.orientation.toLowerCase())
      );
    }

    setFilteredPaintings(filtered);
  }, [filters, paintings]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/painting/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      alert(result.message);
      fetchPaintings();
    } catch (error) {
      console.error("Ошибка удаления картины:", error);
    }
  };

  const handleEdit = (painting) => {
    setEditingPainting(painting);
    setFormData({
      title: painting.title,
      price: painting.price,
      color: painting.color,
      description: painting.description,
      size: painting.size,
      material: painting.material,
      orientation: painting.orientation,
      mainImage: null,
      additionalImages: [],
    });
    setModalIsOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("color", formData.color);
    data.append("description", formData.description);
    data.append("size", formData.size);
    data.append("material", formData.material);
    data.append("orientation", formData.orientation);

    if (formData.mainImage && formData.mainImage[0]) {
      data.append("mainImage", formData.mainImage[0]);
    }
    if (formData.additionalImages) {
      for (let i = 0; i < formData.additionalImages.length; i++) {
        data.append("additionalImages", formData.additionalImages[i]);
      }
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/painting/${editingPainting._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      const result = await res.json();
      alert(result.message);
      setModalIsOpen(false);
      setEditingPainting(null);
      fetchPaintings();
    } catch (error) {
      console.error("Ошибка обновления картины:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="admin_list_container">
      <h2 className="admin_h">Управление картинами</h2>
      <div className="admin_list_filters">
        <input
          type="text"
          name="searchQuery"
          placeholder="Поиск по названию"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
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
          type="text"
          name="color"
          placeholder="Цвет"
          value={filters.color}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="text"
          name="description"
          placeholder="Описание"
          value={filters.description}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="text"
          name="size"
          placeholder="Размер"
          value={filters.size}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="text"
          name="material"
          placeholder="Материал"
          value={filters.material}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <input
          type="text"
          name="orientation"
          placeholder="Ориентация"
          value={filters.orientation}
          onChange={handleFilterChange}
          className="admin_list_input admin_filter_input"
        />
        <button className="admin_list_button" onClick={resetFilters}>
          Очистить фильтры
        </button>
      </div>
      {filteredPaintings.length === 0 ? (
        <p>Нет добавленных картин</p>
      ) : (
        <div className="admin_list_cardContainer">
          {filteredPaintings.map((painting) => (
            <div key={painting._id} className="admin_list_card">
              <div className="admin_list_images">
                <div className="admin_list_imageContainer">
                  {painting.mainImage && (
                    <img
                      src={`http://localhost:5000/${painting.mainImage}`}
                      alt={painting.title}
                      className="admin_list_mainImage"
                    />
                  )}
                </div>
                <div className="admin_list_imageContainer">
                  {painting.additionalImages &&
                    painting.additionalImages.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${img}`}
                        alt={`${painting.title}-${index}`}
                        className="admin_list_additionalImage"
                      />
                    ))}
                </div>
              </div>
              <div className="admin_list_text">
                <h3 className="admin_list_cardTitle">{painting.title}</h3>
                <p>
                  <strong>Цена:</strong> {painting.price}
                </p>
                <p>
                  <strong>Цвет:</strong> {painting.color}
                </p>
                <p>
                  <strong>Описание:</strong> {painting.description}
                </p>
                <p>
                  <strong>Размер:</strong> {painting.size}
                </p>
                <p>
                  <strong>Материал:</strong> {painting.material}
                </p>
                <p>
                  <strong>Ориентация:</strong> {painting.orientation}
                </p>

                <div className="admin_list_buttonContainer">
                  <button
                    className="admin_list_button"
                    onClick={() => handleEdit(painting)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="admin_list_button"
                    onClick={() => {
                      setPaintingToDelete(painting._id);
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
        <h3>Редактирование картины: {editingPainting?.title}</h3>
        <form
          onSubmit={handleUpdate}
          encType="multipart/form-data"
          className="admin_list_form"
        >
          <input
            type="text"
            name="title"
            value={formData?.title}
            onChange={handleChange}
            placeholder="Название"
            required
            className="admin_list_input"
          />
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
            type="text"
            name="color"
            value={formData?.color}
            onChange={handleChange}
            placeholder="Цвет"
            className="admin_list_input"
          />
          <input
            type="text"
            name="description"
            value={formData?.description}
            onChange={handleChange}
            placeholder="Описание"
            className="admin_list_input"
          />
          <input
            type="text"
            name="size"
            value={formData?.size}
            onChange={handleChange}
            placeholder="Размер"
            className="admin_list_input"
          />
          <input
            type="text"
            name="material"
            value={formData?.material}
            onChange={handleChange}
            placeholder="Материал"
            className="admin_list_input"
          />
          <input
            type="text"
            name="orientation"
            value={formData?.orientation}
            onChange={handleChange}
            placeholder="Ориентация"
            className="admin_list_input"
          />

          <div>
            <label>Главное изображение (новое, если нужно изменить):</label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleFileChange}
              className="admin_list_input"
            />
          </div>
          <div>
            <label>Дополнительные изображения:</label>
            <input
              type="file"
              name="additionalImages"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="admin_list_input"
            />
          </div>

          <button
            type="submit"
            className="admin_list_button admin_list_button_one"
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
        <h3>Вы уверены, что хотите удалить эту картину?</h3>
        <div className="admin_list_buttonContainer">
          <button
            className="admin_list_button admin_list_button_one"
            onClick={() => {
              handleDelete(paintingToDelete);
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

export default AdminPaintingsList;
