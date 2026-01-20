import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ login: formData.login, password: formData.password });
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Ошибка при входе');
      } else {
        setError('Ошибка при входе');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h1>Вход</h1>
          <p className="subtitle">Войдите в свой аккаунт</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Логин или Email</label>
              <input
                id="login"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="your_login or your@email.com"
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
                placeholder="Введите пароль"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>

          <p className="auth-link">
            Нет аккаунта? <Link to="/auth/register">Зарегистрируйтесь</Link>
          </p>
        </div>

        <div className="login-image">
          <div className="image-placeholder">
            <h2>Добро пожаловать</h2>
            <p>на озеро Байкал 🏔️</p>
          </div>
        </div>
      </div>
    </div>
  );
};
