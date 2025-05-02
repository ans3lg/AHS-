import { useState } from "react";
import AdminPanel from "./AdminPanel"; // Форма для добавления картин
import AdminMasterclass from "./AdminMasterclass"; // Форма для добавления мастер-классов
import "./AdminAdd.css";

const AdminAdd = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  return (
    <div className="admin-add">
      <h2>Добавление</h2>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {/* 🔘 Кнопки переключения */}
      <div className="admin-add-buttons">
        <button onClick={() => setActiveTab("painting")}>Добавить картину</button>
        <button onClick={() => setActiveTab("masterclass")}>Добавить мастер-класс</button>
      </div>

      {/* 📌 Отображаем нужную форму */}
      {activeTab === "painting" && <AdminPanel setNotification={setNotification} />}
      {activeTab === "masterclass" && <AdminMasterclass setNotification={setNotification} />}
    </div>
  );
};

export default AdminAdd;
