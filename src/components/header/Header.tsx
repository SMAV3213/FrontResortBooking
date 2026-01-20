import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import './Header.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏔️</span>
          <span className="logo-text">Байкал</span>
        </Link>

        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/booking" className="nav-link">Бронирование</Link>
          {isAuthenticated && <Link to="/admin" className="nav-link">Админ</Link>}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">👤 {user?.login}</span>
              <button className="logout-button" onClick={handleLogout}>
                Выход
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth/login" className="login-button">
                Вход
              </Link>
              <Link to="/auth/register" className="register-button">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
