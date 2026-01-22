import React from 'react'
import { Link } from 'react-router-dom'

const Forbidden: React.FC = () => (
  <div className="br-container" style={{ padding: 24 }}>
    <h1>Доступ запрещён</h1>
    <p>У вас нет прав для просмотра этой страницы.</p>
    <Link to="/">На главную</Link>
  </div>
)

export default Forbidden