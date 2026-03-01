# 📱 Адаптивный дизайн - Инструкция по использованию

## 🎯 Обзор улучшений

Весь фронтэнд переработан на полный адаптивный дизайн с поддержкой всех размеров экранов от 320px и выше.

## 📐 Точки разрыва (Breakpoints)

Используются следующие точки разрыва в `styles/_variables.scss`:

```scss
$bp-sm: 520px;    /* Мобильные телефоны */
$bp-md: 760px;    /* Планшеты в портретной ориентации */
$bp-lg: 980px;    /* Планшеты в альбомной ориентации */
$bp-xl: 1200px;   /* Десктопы */
```

## 🔧 Что было адаптировано

### ✅ Компоненты

- **Header** - адаптивная навигация, скрытие меню на мобильных
- **Hero** - масштабируемые заголовки и поисковая форма
- **TypeCard** - адаптивные карточки с изображениями
- **TypeList** - отзывчивая сетка (auto-fill, auto-fit)
- **TypeInfo** - модальное окно для мобильных
- **Footer** - вертикальное расположение ссылок на мобильных
- **Layout** - оптимизированные отступы

### ✅ Страницы

- **Home** - масштабируемые размеры шрифта
- **Types** - адаптивная сетка номеров
- **Profile** - однолетний макет на мобильных
- **Admin** - вертикальное расположение элементов
- **Auth** - форма на полную ширину на мобильных
- **AboutUs** - отзывчивая сетка контактов

### ✅ Глобальные стили

- Шрифты 16px для предотвращения зума iOS
- Smooth scrolling для мобильных
- Оптимизированные контейнеры
- Touch-friendly интерактивные элементы

## 🎨 Использование медиа-запросов

### Правильный способ

```scss
// Мобильные первы (mobile-first)
.element {
  font-size: 14px;
  padding: 12px;
}

@media (max-width: v.$bp-sm) {
  .element {
    font-size: 12px;
    padding: 8px;
  }
}

@media (max-width: v.$bp-md) {
  .element {
    flex-direction: column;
  }
}
```

### Размеры шрифтов по устройствам

```scss
// Для заголовков
h1 {
  font-size: 52px;           // Десктоп
}

@media (max-width: v.$bp-lg) {
  h1 { font-size: 44px; }    // Планшет альбомный
}

@media (max-width: v.$bp-md) {
  h1 { font-size: 36px; }    // Планшет портретный
}

@media (max-width: v.$bp-sm) {
  h1 { font-size: 28px; }    // Мобильный
}
```

## 🚀 Готовые утилиты

В файле `styles/responsive.scss` есть готовые классы:

```html
<!-- Скрыть на мобильных -->
<div class="hide-mobile">Только на десктопе</div>

<!-- Показать только на мобильных -->
<div class="show-mobile">Только на мобильном</div>

<!-- Стек на мобильных -->
<div class="flex-between stack-mobile">
  <div>Элемент 1</div>
  <div>Элемент 2</div>
</div>

<!-- Touch-friendly кнопки -->
<button class="btn touch-target">Клик</button>

<!-- Полная ширина -->
<input class="input full-width-mobile" />

<!-- Отзывчивая сетка -->
<div class="grid-auto">
  <div class="card">Карточка 1</div>
  <div class="card">Карточка 2</div>
</div>
```

## 📏 Контейнеры

### `.br-container` (используется везде)

Автоматически адаптируется:
- На мобильных: 16px паддинг (8px сверху + 8px содержимого)
- На планшетах: 16px паддинг
- На десктопах: max-width 1200px + 32px паддинг

## 🎮 Touch-friendly дизайн

### Минимальные размеры для касания

- Кнопки: 44px высота (48px на мобильных)
- Ссылки: 44px min-height
- Input-поля: 44px высота (автоматически увеличена на мобильных)

```scss
.btn {
  height: 44px;
  padding: 0 16px;
  font-size: 16px; // iOS не зумирует
}

@media (max-width: v.$bp-sm) {
  .btn {
    height: 40px;
    padding: 0 12px;
    font-size: 13px;
  }
}
```

## 🖼️ Изображения

### Адаптивные изображения

```html
<img src="image.jpg" class="img-responsive" alt="Описание" />
```

### Адаптивные background-images

```scss
.hero {
  background-size: cover;
  background-position: center;
  background-image: url('...');
}
```

## ⚙️ Оптимизация производительности

### 1. Используйте CSS Grid с auto-fit/auto-fill

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

### 2. Минимизируйте использование position: fixed

На мобильных это может вызвать проблемы с видимостью и скроллингом.

### 3. Используйте `prefers-reduced-motion`

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## 📱 Тестирование на мобильных

### Chrome DevTools

1. Нажмите F12
2. Нажмите Ctrl+Shift+M (Cmd+Shift+M на Mac)
3. Выберите нужное устройство

### Проверяемые размеры

- iPhone SE (375px)
- iPhone 12 (390px)
- Galaxy S10 (412px)
- iPad Mini (768px)
- iPad Pro (1024px)

## 🐛 Частые проблемы и решения

### Проблема: Зум на iOS при вводе текста

**Решение:** Установите `font-size: 16px` на input/textarea

```scss
input, textarea {
  font-size: 16px; // Предотвращает зум
}
```

### Проблема: Горизонтальный скролл на мобильном

**Решение:** Проверьте, что все элементы не превышают 100% ширину

```scss
.element {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
```

### Проблема: Тап-дилей на мобильном

**Решение:** Используйте `touch-action: manipulation`

```scss
button, a {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

## 🎯 Чек-лист для разработчиков

При создании новых компонентов проверьте:

- [ ] Используются ли правильные размеры шрифтов?
- [ ] Адаптированы ли паддинги и маржины?
- [ ] Работает ли flex/grid на мобильных?
- [ ] Имеют ли кнопки размер минимум 44px?
- [ ] Тестировано на iPhone SE (375px)?
- [ ] Тестировано на планшете?
- [ ] Отсутствуют ли горизонтальные скроллы?
- [ ] Изображения адаптивны?

## 📚 Дополнительные ресурсы

- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Mobile-friendly](https://web.dev/responsive-web-design-basics/)
- [Apple: Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)

## 👨‍💻 Примеры компонентов

### Адаптивная карточка

```tsx
// Card.tsx
import s from './Card.module.scss'

export const Card = ({ title, description }) => (
  <div className={s.card}>
    <h3 className={s.title}>{title}</h3>
    <p className={s.description}>{description}</p>
  </div>
)
```

```scss
// Card.module.scss
@use '../../styles/variables' as v;

.card {
  padding: 16px;
  border-radius: 16px;
}

@media (max-width: v.$bp-sm) {
  .card {
    padding: 12px;
    border-radius: 12px;
  }
}

.title {
  font-size: 18px;
}

@media (max-width: v.$bp-sm) {
  .title {
    font-size: 16px;
  }
}

.description {
  font-size: 14px;
}

@media (max-width: v.$bp-sm) {
  .description {
    font-size: 13px;
  }
}
```

---

**Версия:** 1.0  
**Дата обновления:** Март 2026  
**Автор:** Адаптивный дизайн - полная переработка
