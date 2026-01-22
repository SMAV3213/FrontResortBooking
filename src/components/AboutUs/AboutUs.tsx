import React from 'react'
import clsx from 'clsx'
import s from './AboutUs.module.scss'

type TeamMember = {
  name: string
  role: string
  photo?: string
}

const team: TeamMember[] = [
  { name: 'Анна Лебедева', role: 'Управляющая отелем', photo: 'https://picsum.photos/seed/team1/320/320' },
  { name: 'Максим Орлов', role: 'Руководитель сервиса', photo: 'https://picsum.photos/seed/team2/320/320' },
  { name: 'Екатерина Носова', role: 'Администратор', photo: 'https://picsum.photos/seed/team3/320/320' },
  { name: 'Илья Смирнов', role: 'Шеф‑повар', photo: 'https://picsum.photos/seed/team4/320/320' },
]

const stats = [
  { label: 'Номеров', value: '48' },
  { label: 'Лет работы', value: '7' },
  { label: 'Средний рейтинг', value: '4.8' },
  { label: 'Гостей в год', value: '12k+' },
]

const About: React.FC = () => {
  return (
    <main className={s.page}>
      <header className={clsx('br-container', s.hero)}>
        <div className={s.heroLeft}>
          <h1 className={s.h1}>О нас</h1>
          <p className={s.lead}>
            Мы — бутик‑отель с сервисом “как дома”, но с уровнем комфорта “как в отпуске”.
            Забота, тишина и продуманные детали — в каждом номере.
          </p>

          <div className={s.heroActions}>
            <a className={clsx('btn', 'btn-primary')} href="#contacts">
              Связаться
            </a>
            <a className={clsx('btn', 'btn-ghost')} href="#team">
              Команда
            </a>
          </div>
        </div>

        <div className={s.heroRight}>
          <div className={s.heroCard}>
            <div className={s.heroCardTitle}>Что вы получите</div>
            <ul className={s.list}>
              <li>Чистоту и тишину — ежедневно</li>
              <li>Быстрое заселение и поддержку 24/7</li>
              <li>Удобные номера для работы и отдыха</li>
              <li>Честные цены без скрытых доплат</li>
            </ul>
          </div>
        </div>
      </header>

      <section className={clsx('br-container', s.section)}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Наш подход</h2>
          <p className={s.muted}>
            Мы не делаем “просто номера”. Мы делаем опыт проживания.
          </p>
        </div>

        <div className={s.grid3}>
          <article className={s.card}>
            <h3 className={s.h3}>Сервис</h3>
            <p className={s.text}>
              Быстро решаем запросы гостей: от дополнительной подушки до трансфера и рекомендаций по городу.
            </p>
          </article>

          <article className={s.card}>
            <h3 className={s.h3}>Комфорт</h3>
            <p className={s.text}>
              Удобные матрасы, хорошая шумоизоляция, понятная навигация по отелю и продуманное освещение.
            </p>
          </article>

          <article className={s.card}>
            <h3 className={s.h3}>Честность</h3>
            <p className={s.text}>
              Прозрачные правила и цены. Никаких “сюрпризов” при заселении и выезде.
            </p>
          </article>
        </div>
      </section>

      <section className={clsx('br-container', s.section)}>
        <div className={s.stats}>
          {stats.map((x) => (
            <div key={x.label} className={s.stat}>
              <div className={s.statValue}>{x.value}</div>
              <div className={s.statLabel}>{x.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className={clsx('br-container', s.section)}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Команда</h2>
          <p className={s.muted}>
            Люди, которые делают ваш отдых спокойным и предсказуемо комфортным.
          </p>
        </div>

        <div className={s.grid4}>
          {team.map((m) => (
            <div key={m.name} className={s.person}>
              <div
                className={s.avatar}
                style={m.photo ? { backgroundImage: `url(${m.photo})` } : undefined}
                aria-hidden="true"
              />
              <div className={s.personName}>{m.name}</div>
              <div className={s.personRole}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contacts" className={clsx('br-container', s.section)}>
        <div className={s.contactGrid}>
          <div className={s.card}>
            <h2 className={s.h2}>Контакты</h2>

            <div className={s.contactRows}>
              <div className={s.row}>
                <div className={s.key}>Телефон</div>
                <a className={s.val} href="tel:+79990000000">
                  +7 (999) 000‑00‑00
                </a>
              </div>

              <div className={s.row}>
                <div className={s.key}>Email</div>
                <a className={s.val} href="mailto:hello@hotel.ru">
                  hello@hotel.ru
                </a>
              </div>

              <div className={s.row}>
                <div className={s.key}>Адрес</div>
                <div className={s.val}>г. Москва, ул. Примерная, 10</div>
              </div>

              <div className={s.row}>
                <div className={s.key}>Время</div>
                <div className={s.val}>Круглосуточно</div>
              </div>
            </div>

            <div className={s.actions}>
              <button
                type="button"
                className={clsx('btn', 'btn-primary')}
                onClick={() => alert('Открыть форму обратной связи')}
              >
                Написать нам
              </button>
              <button type="button" className={clsx('btn', 'btn-ghost')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Наверх
              </button>
            </div>
          </div>

          <div className={clsx(s.card, s.mapCard)}>
            <div className={s.mapStub}>
              Карта (вставь сюда Яндекс/Google iframe)
            </div>
          </div>
        </div>
      </section>

      <footer className={clsx('br-container', s.footer)}>
        <div className={s.footerInner}>
          <div className={s.footerLeft}>
            <div className={s.brand}>Boutique Hotel</div>
            <div className={s.muted}>Комфортные номера • прозрачные условия • поддержка 24/7</div>
          </div>

          <div className={s.footerRight}>
            <a className={s.footerLink} href="#team">Команда</a>
            <a className={s.footerLink} href="#contacts">Контакты</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default About