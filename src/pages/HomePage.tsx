import React from 'react';
import { Link } from 'react-router-dom';
import { QuickBooking } from '../components/QuickBooking';
import { AboutUs } from '../components/AboutUs';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🏔️ Озеро Байкал</h1>
          <p>Отель на берегу самого чистого озера в мире</p>
          <Link to="/booking" className="hero-button">
            Начать бронирование
          </Link>
        </div>
      </section>

      {/* Quick Booking */}
      <QuickBooking />

      {/* About Us */}
      <AboutUs />

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Почему выбирают нас?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Быстрое бронирование</h3>
              <p>Забронируйте номер в несколько кликов</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Безопасность</h3>
              <p>Защита ваших личных данных - приоритет</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Лучшие цены</h3>
              <p>Самые конкурентные цены на рынке</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>24/7 Поддержка</h3>
              <p>Мы всегда на связи для вас</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Разнообразие выбора</h3>
              <p>Номера для любых вкусов и бюджета</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Премиум сервис</h3>
              <p>Высокое качество обслуживания</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Готовы забронировать ваш отдых?</h2>
          <p>Выберите подходящий номер из нашего каталога</p>
          <Link to="/booking" className="cta-button">
            Перейти к номерам
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Resort Booking на Байкале. Все права защищены.</p>
          <div className="footer-links">
            <a href="#privacy">Приватность</a>
            <a href="#terms">Условия использования</a>
            <a href="#contact">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
