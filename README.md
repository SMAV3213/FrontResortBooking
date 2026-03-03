# 🏨 Resort Booking System - Frontend

Современное веб-приложение для бронирования номеров в отелях, разработано на **React 19** + **TypeScript** с использованием **Vite**.

---

## ⚡ Быстрый старт

### Требования
- Node.js 18+ (npm или yarn)
- Backend сервер (локально на `http://localhost:5001`)

### Установка (3 минуты)

```bash
# 1. Переходим в директорию фронта
cd frontend

# 2. Устанавливаем зависимости
npm install

# 3. Запускаем dev сервер
npm run dev
```

Откройте в браузере: **http://localhost:5173**

---

## 📚 Структура проекта

```
frontend/
│
├── src/
│   ├── main.tsx                  # Точка входа приложения
│   ├── App.tsx                   # Главный компонент
│   ├── index.html                # HTML файл
│   │
│   ├── api/                      # Axios конфигурация и запросы к API
│   ├── auth/                     # Authentication логика, токены
│   ├── components/               # Переиспользуемые UI компоненты
│   ├── modals/                   # Модальные окна
│   ├── pages/                    # Страницы приложения
│   ├── routes/                   # Конфигурация маршрутов
│   ├── shared/                   # Общие утилиты и constants
│   ├── styles/                   # Глобальные стили (SASS)
│   ├── theme/                    # Конфигурация темы оформления
│   ├── types/                    # TypeScript типы и интерфейсы
│   └── utils/                    # Вспомогательные функции
│
├── public/                       # Статические файлы (изображения, иконки)
├── vite.config.ts               # Конфигурация Vite
├── tsconfig.json                # Конфигурация TypeScript
├── eslint.config.js             # Конфигурация ESLint
└── package.json                 # Зависимости и скрипты
```

---

## 🚀 Доступные команды

```bash
# Запуск dev сервера (с hot reload)
npm run dev

# Production сборка
npm run build

# Проверка кода ESLint (поиск ошибок)
npm run lint

# Превью production сборки локально
npm run preview
```

---

## 🏗️ Технологический стек

| Технология | Версия | Описание |
|-----------|--------|---------|
| **React** | 19.2.0 | Основной фреймворк |
| **TypeScript** | ~5.9.3 | Типизация JavaScript |
| **Vite** | 7.2.4 | Быстрая сборка и dev сервер |
| **React Router** | 7.12.0 | Управление маршрутами |
| **Axios** | 1.13.2 | HTTP клиент для API запросов |
| **Headless UI** | 2.2.9 | Незастилизованные компоненты |
| **SASS** | 1.97.2 | Препроцессор CSS |
| **ESLint** | 9.39.1 | Linter для проверки кода |

---

## 🔐 Аутентификация

Приложение использует **JWT токены** для авторизации:

```typescript
// src/auth/useAuth.ts
- Сохранение токенов в localStorage
- Автоматическое подключение токена к запросам
- Обновление токена при истечении (refresh token)
- Logout с очисткой состояния
```

---

## 🌐 API интеграция

Все запросы к backend'у отправляются через **Axios**:

```typescript
// src/api/apiClient.ts
- Базовый URL: http://localhost:5001/api
- Автоматическое добавление JWT токена
- Обработка ошибок и статус кодов
- Перенаправление на login при 401 (Unauthorized)
```

---

## 📱 Функциональность

- ✅ **Аутентификация** - регистрация и вход пользователей
- 🔍 **Поиск номеров** - фильтрация по типам и датам
- 📅 **Бронирование** - создание и управление бронями
- 👤 **Профиль** - управление данными пользователя
- 🎨 **Отзывчивый дизайн** - работает на всех устройствах
- 🌙 **Темизация** - поддержка светлой/тёмной темы

---

## 🐳 Docker

```bash
# Сборка Docker образа
docker build -t resort-booking-frontend .

# Запуск контейнера
docker run -p 80:80 resort-booking-frontend
```

Приложение будет доступно на **http://localhost**

---

## 📖 Разработка

### Добавление нового компонента

```typescript
// src/components/MyComponent.tsx
import React from 'react'
import './MyComponent.scss'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  )
}
```

### Добавление нового маршрута

```typescript
// src/routes/index.tsx
import { MyPage } from '../pages/MyPage'

export const routes = [
  {
    path: '/my-page',
    element: <MyPage />,
  },
  // ... остальные маршруты
]
```

### API запрос

```typescript
// src/api/myApi.ts
import { apiClient } from './apiClient'
import { MyData } from '../types'

export const fetchMyData = async (): Promise<MyData> => {
  const { data } = await apiClient.get('/my-endpoint')
  return data
}
```

---

## ⚙️ Конфигурация

### Переменные окружения

Создайте файл `.env.local` (не коммитьте его):

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Resort Booking
```

### TypeScript пути

```typescript
// tsconfig.json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@pages/*": ["src/pages/*"]
  }
}
```

Использование:
```typescript
import { Button } from '@components/Button'
import { HomePage } from '@pages/HomePage'
```

---

## 🧪 Тестирование кода

```bash
# Проверка TypeScript
npm run build

# Проверка ESLint
npm run lint

# Проверка типов во время разработки (автоматическая)
# VS Code показывает ошибки в реальном времени
```

---

## 📦 Production сборка

```bash
npm run build
```

Результат:
- Оптимизированный код в папке `dist/`
- Автоматическое минифицирование и сжатие
- Tree-shaking неиспользуемого кода
- Готовый для развёртывания на производстве

---

## 🤝 Разработка в команде

1. **Используйте TypeScript** - никогда не пишите `any`
2. **Следуйте ESLint правилам** - `npm run lint`
3. **Компонентный подход** - переиспользуемые компоненты в `/components`
4. **Типизация** - все пропсы и возвращаемые значения должны быть типизированы
5. **Именование** - используйте kebab-case для файлов, PascalCase для компонентов

---

## 🐛 Решение проблем

### Порт 5173 занят
```bash
npm run dev -- --port 5174
```

### Ошибки TypeScript
```bash
npm run build  # Покажет полный список ошибок
```

### Очистка node_modules
```bash
rm -r node_modules
npm install
```

---

## 📚 Полезные ссылки

- [React документация](https://react.dev)
- [TypeScript документация](https://www.typescriptlang.org/docs)
- [Vite документация](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Axios документация](https://axios-http.com)

---

## 📄 Лицензия

MIT

