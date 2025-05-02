import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  // Извлекаем токен из localStorage
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Ошибка декодирования токена", error);
      user = null;
    }
  }

  // Если пользователь не найден или роль не admin, перенаправляем на главную
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
