import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ isAuthenticated, onLogout, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header">
        <div className="logo">
          <Link to="/"><img src="/Logo.png" alt="Логотип" className="logo_icon"/></Link>
        </div>

        {/* Бургер-меню */}
        <div className={`burger-menu ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Навигация и пользовательские действия */}
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/catalog" onClick={toggleMenu}>Каталог</Link></li>
            <li><Link to="/masterclasses" onClick={toggleMenu}>Мастер-классы</Link></li>
            <li><Link to="/aboutpage" onClick={toggleMenu}>О нас</Link></li>
          </ul>
        </nav>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            {isAuthenticated ? (
              <>
                <li><Link to="/cart" onClick={toggleMenu}><img src="/Basket.svg" alt="Корзина" className="basket_icon"/></Link></li>
                
                <li><Link to="/profile" onClick={toggleMenu}><img src="/profile.svg" alt="Профиль" className="profile_icon"/></Link></li>
                {user && user.role === "admin" && (
                  <li><Link to="/admin" onClick={toggleMenu}><img src="/admin.svg" alt="Админ панель" className="profile_icon"/></Link></li>
                )}
                {user && user.role === "artist" && (
                  <li><Link to="/artist" onClick={toggleMenu}><img src="/painting.svg" alt="Кабинет художника" className="basket_icon"/></Link></li>
                )}
                <li><Link onClick={onLogout}><img src="/logout.svg" alt="Выход" className="basket_icon"/></Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMenu}>Войти</Link></li>
                <li><Link to="/register" onClick={toggleMenu}>Регистрация</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;