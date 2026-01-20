import React from 'react';
import type { RoomType } from '../../types/room';
import './SearchResults.scss';

interface SearchResultsProps {
  rooms: RoomType[];
  isLoading: boolean;
  checkIn: string;
  checkOut: string;
  onRoomSelect?: (room: RoomType) => void;
  onBookClick?: (room: RoomType) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  rooms,
  isLoading,
  checkIn,
  checkOut,
  onRoomSelect,
  onBookClick,
}) => {
  if (!checkIn || !checkOut) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="search-results">
        <div className="loading">
          <div className="spinner"></div>
          <p>Поиск номеров...</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="search-results">
        <div className="no-results">
          <p>К сожалению, нет доступных номеров на выбранные даты</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Доступные номера</h2>
        <p>Найдено {rooms.length} номер{rooms.length === 1 ? '' : 'ов'}</p>
      </div>

      <div className="room-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-image">
              {room.image ? (
                <img src={room.image} alt={room.name} />
              ) : (
                <div className="placeholder-image"></div>
              )}
            </div>

            <div className="room-info">
              <h3>{room.name}</h3>

              <div className="room-details">
                <span className="detail-item">
                  <span className="label">Вместимость:</span>
                  <span className="value">{room.capacity} человека</span>
                </span>
                <span className="detail-item">
                  <span className="label">Цена:</span>
                  <span className="value price">{room.price} руб/ночь</span>
                </span>
              </div>

              <p className="room-description">{room.description}</p>

              <div className="room-actions">
                <button
                  className="btn-view"
                  onClick={() => onRoomSelect && onRoomSelect(room)}
                >
                  Подробнее
                </button>
                <button
                  className="btn-book"
                  onClick={() => onBookClick && onBookClick(room)}
                >
                  Забронировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
