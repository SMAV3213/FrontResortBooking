import React, { useState, useEffect } from 'react';
import { roomApi } from '../api/room';
import type { RoomType } from '../types/room';
import './Booking.scss';

export const BookingPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    guests: 1,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const fetchAvailableRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roomApi.getAvailable({
        guests: Number(filters.guests),
        checkIn: new Date(filters.checkIn),
        checkOut: new Date(filters.checkOut),
      });
      setRooms(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке номеров');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAvailableRooms();
  };

  const calculatePrice = (pricePerNight: number) => {
    const checkIn = new Date(filters.checkIn);
    const checkOut = new Date(filters.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return pricePerNight * Math.max(nights, 1);
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Бронирование номеров</h1>
        <p>Найдите идеальный номер для вашего отдыха</p>
      </div>

      <div className="booking-filters">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="form-group">
            <label htmlFor="guests">Количество гостей</label>
            <select
              id="guests"
              name="guests"
              value={filters.guests}
              onChange={handleFilterChange}
              className="form-input"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} гост{num === 1 ? 'ь' : 'ей'}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="checkIn">Дата заезда</label>
            <input
              id="checkIn"
              type="date"
              name="checkIn"
              value={filters.checkIn}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkOut">Дата выезда</label>
            <input
              id="checkOut"
              type="date"
              name="checkOut"
              value={filters.checkOut}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>

          <button type="submit" disabled={isLoading} className="search-button">
            {isLoading ? 'Поиск...' : 'Найти номера'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-images">
              {room.images && room.images.length > 0 ? (
                <img 
                  src={room.images[0]} 
                  alt={room.name}
                  className="room-image"
                />
              ) : (
                <div className="room-image-placeholder">Нет изображения</div>
              )}
            </div>

            <div className="room-details">
              <h3>{room.name}</h3>
              <p className="room-description">{room.description}</p>

              <div className="room-info">
                <span className="capacity">👥 {room.capacity} гост{room.capacity === 1 ? 'ь' : 'ей'}</span>
              </div>

              <div className="room-pricing">
                <p className="price-per-night">{room.pricePerNight}₽ за ночь</p>
                <p className="total-price">
                  Всего: <strong>{calculatePrice(room.pricePerNight)}₽</strong>
                </p>
              </div>

              <button 
                className="book-button"
                onClick={() => setSelectedRoom(room)}
              >
                Забронировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && !isLoading && !error && (
        <div className="no-rooms">
          <p>Номера не найдены. Попробуйте изменить фильтры.</p>
        </div>
      )}

      {selectedRoom && (
        <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>
            <h2>{selectedRoom.name}</h2>
            <p>{selectedRoom.description}</p>
            <p>Вместимость: {selectedRoom.capacity} человек</p>
            <p>Цена за ночь: {selectedRoom.pricePerNight}₽</p>
            <p>Общая сумма: {calculatePrice(selectedRoom.pricePerNight)}₽</p>
            <button className="confirm-button">
              Подтвердить бронирование
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
