import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomApi } from '../../api/room';
import type { RoomType } from '../../types/room';
import { SearchResults } from '../../components/search-results/SearchResults';
import './BookingPage.scss';

export const BookingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    guests: searchParams.get('guests') || '2',
    checkIn: searchParams.get('checkIn') || today,
    checkOut: searchParams.get('checkOut') || tomorrow,
  });

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
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке номеров');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('checkIn')) {
      fetchAvailableRooms();
    }
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
    setSearchParams({
      guests: filters.guests,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
    });
    fetchAvailableRooms();
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
              min={today}
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
              min={filters.checkIn}
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

      <SearchResults 
        rooms={rooms}
        isLoading={isLoading}
        checkIn={filters.checkIn}
        checkOut={filters.checkOut}
      />

      {!searched && !isLoading && (
        <div className="no-search">
          <p>Используйте фильтры выше для поиска номеров</p>
        </div>
      )}
    </div>
  );
};
