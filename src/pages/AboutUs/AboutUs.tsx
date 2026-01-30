import React from 'react'
import clsx from 'clsx'
import s from './AboutUs.module.scss'

const About: React.FC = () => {
  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.wrap)}>
        <header className={s.header}>
          <h1 className={s.h1}>О нас</h1>
          <p className={s.lead}>
            Baikal Breeze — сервис бронирования номеров для отдыха на Байкале.
            Мы делаем процесс выбора и бронирования простым, быстрым и прозрачным.
          </p>
        </header>

        <section className={s.grid}>
          <div className={s.card}>
            <div className={s.title}>Комфорт</div>
            <div className={s.text}>
              Подбираем номера под разные сценарии: отдых, семейные поездки, деловые поездки.
            </div>
          </div>

          <div className={s.card}>
            <div className={s.title}>Прозрачные условия</div>
            <div className={s.text}>
              Честные цены и понятные правила. Без скрытых платежей и неожиданностей.
            </div>
          </div>

          <div className={s.card}>
            <div className={s.title}>Поддержка</div>
            <div className={s.text}>
              Если возникнут вопросы — поможем с выбором и оформлением бронирования.
            </div>
          </div>
        </section>

        <section className={s.contacts}>
          <div className={s.card}>
            <div className={s.title}>Контакты</div>

            <div className={s.rows}>
              <div className={s.row}>
                <span className={s.key}>Телефон</span>
                <a className={s.val} href="tel:+79990000000">+7 (999) 000‑00‑00</a>
              </div>

              <div className={s.row}>
                <span className={s.key}>Email</span>
                <a className={s.val} href="mailto:hello@baikalbreeze.ru">hello@baikalbreeze.ru</a>
              </div>

              <div className={s.row}>
                <span className={s.key}>Адрес</span>
                <span className={s.val}>Иркутская область, побережье Байкала</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default About