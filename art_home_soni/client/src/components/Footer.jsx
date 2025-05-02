import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Email: info@arthomesoni.com</p>
          <p>Телефон: +7 (123) 456-78-90</p>
          <p>Адрес: г. Альметьевск, ул. Художественная, 15</p>
        </div>
        <div className="footer-section">
          <h3>Социальные сети</h3>
          <ul className="social-links">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                ВК
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Быстрые ссылки</h3>
          <ul className="quick-links">
            <li>
              <a href="#catalog">Каталог</a>
            </li>
            <li>
              <a href="#master-classes">Мастер-классы</a>
            </li>
            <li>
              <a href="#about-us">О нас</a>
            </li>
            <li>
              <a href="#custom-painting">Картина на заказ</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Art Home Soni. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;