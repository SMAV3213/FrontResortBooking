import React, { useState, useEffect } from 'react';
import { roomApi } from '../../api/room';
import type { RoomType, CreateRoomTypeDTO } from '../../types/room';
import './AdminPanel.scss';

export const AdminPanel: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Capacity: 1,
    PricePerNight: 0,
  });

  const [images, setImages] = useState<File[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roomApi.getAll();
      setRooms(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке номеров');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Capacity' || name === 'PricePerNight' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.Name || !formData.Description || formData.PricePerNight <= 0) {
      setError('Пожалуйста, заполните все поля корректно');
      return;
    }

    try {
      setIsLoading(true);

      const data: CreateRoomTypeDTO = {
        ...formData,
        images: images.length > 0 ? images : undefined,
      };

      if (editingRoom) {
        await roomApi.update(editingRoom.id, {
          ...data,
          Id: editingRoom.id,
        });
        setSuccess('Номер успешно обновлен');
      } else {
        await roomApi.create(data);
        setSuccess('Номер успешно создан');
      }

      resetForm();
      fetchRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении номера');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены что хотите удалить этот номер?')) {
      return;
    }

    try {
      setError(null);
      await roomApi.delete(id);
      setSuccess('Номер успешно удален');
      fetchRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении номера');
    }
  };

  const handleEdit = (room: RoomType) => {
    setEditingRoom(room);
    setFormData({
      Name: room.name,
      Description: room.description,
      Capacity: room.capacity,
      PricePerNight: room.pricePerNight,
    });
    setShowForm(true);
    setImages([]);
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      Capacity: 1,
      PricePerNight: 0,
    });
    setImages([]);
    setEditingRoom(null);
    setShowForm(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Админ панель</h1>
        <button 
          className="add-room-button"
          onClick={() => !showForm ? setShowForm(true) : resetForm()}
        >
          {showForm ? 'Отмена' : '+ Добавить номер'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingRoom ? 'Редактировать номер' : 'Новый номер'}</h2>
          <form onSubmit={handleSubmit} className="room-form">
            <div className="form-group">
              <label htmlFor="Name">Название</label>
              <input
                id="Name"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Название номера"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="Description">Описание</label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Описание номера"
                rows={4}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Capacity">Вместимость</label>
                <input
                  id="Capacity"
                  type="number"
                  name="Capacity"
                  value={formData.Capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="PricePerNight">Цена за ночь</label>
                <input
                  id="PricePerNight"
                  type="number"
                  name="PricePerNight"
                  value={formData.PricePerNight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="images">Изображения</label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              {images.length > 0 && (
                <p className="images-count">Выбрано: {images.length} изображений</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </form>
        </div>
      )}

      <div className="rooms-table-container">
        <h2>Все номера</h2>
        {isLoading && !showForm ? (
          <p className="loading">Загрузка...</p>
        ) : (
          <div className="rooms-table">
            {rooms.length === 0 ? (
              <p className="no-data">Номеров не найдено</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Вместимость</th>
                    <th>Цена за ночь</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>{room.description}</td>
                      <td>{room.capacity}</td>
                      <td>{room.pricePerNight}₽</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(room)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(room.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
