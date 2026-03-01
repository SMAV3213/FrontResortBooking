# 📱 Шпаргалка по адаптивному дизайну

## Быстрые примеры

### Адаптивные размеры шрифтов
```scss
// Большие заголовки
.h1 {
  font-size: 52px;
  @media (max-width: v.$bp-md) { font-size: 36px; }
  @media (max-width: v.$bp-sm) { font-size: 28px; }
}

// Обычный текст
.text {
  font-size: 16px;
  @media (max-width: v.$bp-sm) { font-size: 14px; }
}
```

### Адаптивные паддинги
```scss
.card {
  padding: 16px;
  @media (max-width: v.$bp-md) { padding: 12px; }
  @media (max-width: v.$bp-sm) { padding: 8px; }
}
```

### Flex → Column на мобильных
```scss
.flex-row {
  display: flex;
  gap: 16px;
  
  @media (max-width: v.$bp-sm) {
    flex-direction: column;
    gap: 12px;
  }
}
```

### Grid с auto-fit
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: v.$bp-sm) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```

### Скрыть/Показать элементы
```scss
// Скрыть на мобильных
.hide-mobile {
  @media (max-width: v.$bp-md) { display: none; }
}

// Показать только на мобильных
.show-mobile {
  display: none;
  @media (max-width: v.$bp-md) { display: block; }
}
```

### Touch-friendly кнопки
```scss
.btn {
  min-height: 44px;
  padding: 0 16px;
  font-size: 16px;        // iOS не зумирует
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### Адаптивные изображения
```scss
.image {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### Многострочный текст
```scss
.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;   // 2 строки
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Текст в одну строку
```scss
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Готовые классы

```html
<!-- Скрыть на мобильных -->
<div class="hide-mobile">Только десктоп</div>

<!-- Показать только на мобильных -->
<div class="show-mobile">Только мобильный</div>

<!-- Стек на мобильных -->
<div class="flex-between stack-mobile">
  <span>Левый</span>
  <span>Правый</span>
</div>

<!-- Полная ширина -->
<input class="input full-width-mobile" />

<!-- Touch-friendly -->
<button class="btn touch-target">Кнопка</button>

<!-- Отзывчивая сетка -->
<div class="grid-auto">
  <div>Карточка 1</div>
  <div>Карточка 2</div>
</div>

<!-- Шрифт для текстовых полей -->
<input class="input mobile-readable" />

<!-- Центрирование -->
<div class="flex-center">Содержимое</div>

<!-- Пространство между -->
<div class="flex-between">
  <div>Слева</div>
  <div>Справа</div>
</div>

<!-- Переносимый текст -->
<p class="word-break">Очень-очень-очень-длинное-слово</p>

<!-- Обрезание текста -->
<p class="line-clamp-2">Текст на 2 строки...</p>

<!-- Отзывчивые картинки -->
<img src="..." class="img-responsive" />
```

## Breakpoints

```
320px  ← Мобильные (iPhone SE)
520px  ← $bp-sm (большие телефоны)
760px  ← $bp-md (планшеты портрет)
980px  ← $bp-lg (планшеты альбом)
1200px ← $bp-xl (десктопы)
```

## Структура SCSS

```scss
@use '../../styles/variables' as v;

.component {
  /* Десктоп стили */
  font-size: 16px;
  padding: 16px;
}

@media (max-width: v.$bp-lg) {
  .component {
    font-size: 15px;
  }
}

@media (max-width: v.$bp-md) {
  .component {
    font-size: 14px;
    padding: 12px;
  }
}

@media (max-width: v.$bp-sm) {
  .component {
    font-size: 12px;
    padding: 8px;
  }
}
```

## Частые проблемы

### iOS зумирует input
```scss
input { font-size: 16px; } ✅
input { font-size: 14px; } ❌
```

### Горизонтальный скролл
```scss
.element {
  width: 100%;      ✅
  width: 110%;      ❌
  overflow-x: auto; // Только если нужен скролл
}
```

### Кнопка слишком маленькая
```scss
.btn { min-height: 44px; } ✅
.btn { height: 32px; }    ❌
```

## Проверка в DevTools

1. F12 → Ctrl+Shift+M
2. Выберите устройство (iPhone 12)
3. Проверьте разные размеры

## Полезные ссылки

- [Документация](./RESPONSIVE_DESIGN.md)
- [CSS Tricks](https://css-tricks.com/a-complete-guide-to-grid/)
- [MDN Responsive](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
