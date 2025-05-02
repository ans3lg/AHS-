import { Routes, Route, NavLink } from "react-router-dom";
import AdminBookings from "../components/AdminBookings";
import AdminPaintingsList from "../components/AdminPaintingsList";
import AdminMasterclassesList from "../components/AdminMasterclassesList";
import AdminOrders from "../components/AdminOrders";
import AdminStats from "../components/AdminStats";
import AdminAdd from "../components/AdminAdd";
import "./Admin.css";

const Admin = () => (
  <div className="admin">
    <div className="admin-w">
      <h1>Панель администратора</h1>

      <nav className="admin-nav">
        <NavLink to="/admin/add">Добавление</NavLink>
        <NavLink to="/admin/paintings">Картины</NavLink>
        <NavLink to="/admin/masterclasses-list">Мастер-классы</NavLink>
        <NavLink to="/admin/bookings">Записи</NavLink>
        <NavLink to="/admin/orders">Заказы</NavLink>
        <NavLink to="/admin/stats">Отчетность</NavLink>
      </nav>

      <Routes>
        <Route path="add" element={<AdminAdd />} />
        <Route path="paintings" element={<AdminPaintingsList />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="masterclasses-list" element={<AdminMasterclassesList />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="stats" element={<AdminStats />} />
      </Routes>
    </div>
  </div>
);

export default Admin;
