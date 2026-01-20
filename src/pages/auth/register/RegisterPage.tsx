import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import './RegisterPage.scss';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.login || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('Все поля обязательны');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        login: formData.login,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Ошибка при регистрации');
      } else {
        setError('Ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-image">
          <div className="image-placeholder">
            <h2>Присоединяйтесь</h2>
            <p>к семье отеля на Байкале 🎿</p>
          </div>
        </div>

        <div className="register-form">
          <h1>Регистрация</h1>
          <p className="subtitle">Создайте новый аккаунт</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                id="login"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="your_login"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Номер телефона</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+7 (999) 999-99-99"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите пароль"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="auth-link">
            Уже есть аккаунт? <Link to="/auth/login">Войдите</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
