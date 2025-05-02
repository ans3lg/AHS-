import { useEffect, useState } from "react";
import "./Profile.css";
import BookingsPage from "./BookingsPage";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [notification, setNotification] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error("Ошибка загрузки заказов:", data.message);
      }
    } catch (error) {
      console.error("Ошибка сервера", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Берём токен из localStorage
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
      } else {
        console.error("Ошибка:", data.message);
      }
    } catch (error) {
      console.error("Ошибка сервера", error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification("Данные профиля успешно обновлены");
        setUser(data);
        setEditMode(false);
      } else {
        setNotification("Ошибка обновления профиля: " + data.message);
      }
    } catch (error) {
      console.error("Ошибка сервера", error);
      setNotification("Ошибка сервера");
    }
    setTimeout(() => setNotification(""), 3000);
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setNotification("Новый пароль и подтверждение не совпадают");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNotification("Пароль успешно изменён");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setNotification("Ошибка смены пароля: " + data.message);
      }
    } catch (error) {
      console.error("Ошибка сервера", error);
      setNotification("Ошибка сервера");
    }
    setTimeout(() => setNotification(""), 3000);
  };

  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="profile-page">
      {notification && <div className="notification">{notification}</div>}
      <Link to="/bookings" className="bookings-link">
          Посмотреть заявки на мастер-классы
        </Link>
      <div className="profile-card">
        <h2>Профиль</h2>
        {editMode ? (
          <div className="profile-form">
            <label>
              Имя:
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
            </label>
            <label>
              Телефон:
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </label>
            <div className="form-buttons">
              <button onClick={updateProfile}>Сохранить изменения</button>
              <button onClick={() => setEditMode(false)}>Отмена</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p>
              <strong>Имя:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Телефон:</strong> {user.phone}
            </p>
            <button onClick={() => setEditMode(true)}>
              Редактировать профиль
            </button>
          </div>
        )}
      </div>

      <div className="password-card">
        <h2>Сменить пароль</h2>
        <div className="password-form">
          <label>
            Текущий пароль:
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Новый пароль:
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Подтвердите новый пароль:
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <button onClick={updatePassword}>Изменить пароль</button>
        </div>
      </div>

      <div className="orders-section">
        <h2>Мои заказы</h2>
        {orders.length === 0 ? (
          <p>У вас пока нет заказов.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <p>
                  <strong>Дата заказа:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Сумма:</strong> {order.totalPrice} руб.
                </p>
                <p className={`order-status ${order.status}`}>
                  Статус: {order.status}
                </p>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.paintingId._id} className="order-item">
                      <img
                        src={`http://localhost:5000/${item.paintingId.mainImage}`}
                        alt={item.paintingId.title}
                        className="order-item-image"
                      />
                      <div className="order-item-details">
                        <p>
                          <strong>{item.paintingId.title}</strong>
                        </p>
                        <p>Количество: {item.quantity} шт.</p>
                        <p>Цена: {item.paintingId.price} руб.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
