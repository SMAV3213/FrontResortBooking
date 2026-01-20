import React from 'react';
import './AboutUs.scss';

export const AboutUs: React.FC = () => {
  return (
    <section className="about-us">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>О нашем отеле</h2>
            <p className="about-intro">
              Добро пожаловать на Байкал! Наш уникальный отель расположен на берегу самого глубокого озера в мире, предлагая незабываемые впечатления среди девственной природы Сибири.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🏔️</span>
                <h4>Живописные виды</h4>
                <p>Панорамный вид на горы и кристально чистые воды Байкала прямо из вашего номера</p>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🌲</span>
                <h4>Природный рай</h4>
                <p>Окружены тайгой, где обитают редкие виды животных и растений</p>
              </div>

              <div className="feature-item">
                <span className="feature-icon">❄️</span>
                <h4>Год-арий сезон</h4>
                <p>Зимой кристальный лёд озера, летом теплые дни для активного отдыха</p>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h4>Комфорт и экология</h4>
                <p>Современные удобства с соблюдением экологических стандартов</p>
              </div>
            </div>

            <p className="about-text-full">
              Наш отель был создан для тех, кто ценит природу и ищет спокойствие вдали от суеты. 
              Каждый номер спроектирован с учетом максимального комфорта и минимального воздействия на окружающую среду.
              Мы предлагаем экскурсии, водные прогулки, рыбалку и много других активностей.
            </p>
          </div>

          <div className="about-image">
            <div className="image-placeholder">
              <span>🏞️ Байкал</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
