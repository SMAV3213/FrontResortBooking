import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuickBooking } from '../../components/quick-booking/QuickBooking';
import { SearchResults } from '../../components/search-results/SearchResults';
import { Modal } from '../../components/modal/Modal';
import { roomApi } from '../../api/room';
import type { RoomType } from '../../types/room';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    guests: '2',
    checkIn: '',
    checkOut: ''
  });

  const handleSearch = async (searchFilters: typeof filters) => {
    setFilters(searchFilters);
    setIsLoading(true);
    setSearched(true);

    try {
      const available = await roomApi.getAvailable(
        searchFilters.checkIn,
        searchFilters.checkOut,
        parseInt(searchFilters.guests)
      );
      setRooms(available);
    } catch (error) {
      console.error('Ошибка при поиске номеров:', error);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomSelect = (room: RoomType) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Озеро Байкал</h1>
          <p>Отель на берегу самого чистого озера в мире</p>
          <Link to="/room-types" className="hero-button">
            Смотреть все номера
          </Link>
        </div>
      </section>

      {/* Quick Booking */}
      <QuickBooking onSearch={handleSearch} />

      {/* Search Results */}
      {searched && (
        <section className="search-results-section">
          <SearchResults
            rooms={rooms}
            isLoading={isLoading}
            checkIn={filters.checkIn}
            checkOut={filters.checkOut}
            onRoomSelect={handleRoomSelect}
          />
        </section>
      )}

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
          <Link to="/room-types" className="cta-button">
            Смотреть каталог номеров
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Resort Booking на Байкале. Все права защищены.</p>
          <div className="footer-links">
            <a href="#privacy">Приватность</a>
            <a href="#terms">Условия использования</a>
            <a href="#contact">Контакты</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal room={selectedRoom} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
