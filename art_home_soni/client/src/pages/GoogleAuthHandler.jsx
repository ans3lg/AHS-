import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleAuthHandler({ setUser, setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);

      // Получаем профиль
      fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data); // <-- Устанавливаем пользователя
          setIsAuthenticated(true);
          navigate("/");
        })
        .catch((err) => {
          console.error("Ошибка загрузки профиля:", err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Вход через Google... Пожалуйста, подождите.</div>;
}

export default GoogleAuthHandler;
