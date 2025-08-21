# 🌟 Hello World - Telegram Mini App

Простое приложение "Hello World" для изучения разработки Telegram Mini Apps с использованием Next.js, React и TypeScript.

## 📱 Что это такое?

Это базовое приложение демонстрирует:
- ✅ Интеграцию с Telegram Mini Apps SDK
- ✅ Использование Telegram UI Kit для нативного вида
- ✅ Интерактивные элементы (кнопки, анимации)
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ TypeScript для типобезопасности

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### 3. Для HTTPS (рекомендуется для тестирования в Telegram)
```bash
npm run dev:https
```

Приложение будет доступно по адресу: `https://localhost:3000`

## 🔧 Настройка Telegram Bot

### Шаг 1: Создание бота
1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните токен бота

### Шаг 2: Настройка Mini App
1. Отправьте `/newapp` в [@BotFather](https://t.me/BotFather)
2. Выберите вашего бота
3. Введите название приложения
4. Введите описание
5. Загрузите иконку (512x512 px)
6. Введите URL вашего приложения (например: `https://yourapp.com`)

### Шаг 3: Тестирование
- Для разработки используйте: `https://localhost:3000`
- Для продакшена: ваш домен

## 📁 Структура проекта

```
telegram-hello-world/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница (Hello World)
│   │   ├── layout.tsx         # Корневой layout
│   │   └── _assets/           # Стили и ресурсы
│   ├── components/            # React компоненты
│   └── core/                  # Основная логика и утилиты
├── public/                    # Статические файлы
├── package.json
└── README.md
```

## 🎨 Особенности приложения

### Интерактивные элементы:
- 🎯 Кнопка "Нажми меня!" с анимацией
- 📊 Счетчик нажатий
- 🎉 Появляющееся приветствие
- 📱 Адаптивный дизайн

### Используемые технологии:
- **Next.js 15** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **Telegram Apps SDK** - интеграция с Telegram
- **Telegram UI Kit** - нативные UI компоненты
- **CSS Animations** - плавные анимации

## 🛠 Команды разработки

```bash
# Разработка
npm run dev              # Запуск на http://localhost:3000
npm run dev:https        # Запуск на https://localhost:3000

# Продакшен
npm run build            # Сборка приложения
npm start                # Запуск собранного приложения

# Проверка кода
npm run lint             # ESLint проверка
```

## 🌐 Деплой

### Vercel (рекомендуется)
1. Загрузите код на GitHub
2. Подключите репозиторий к [Vercel](https://vercel.com)
3. Vercel автоматически соберет и задеплоит приложение
4. Используйте полученный URL в настройках бота

### Другие платформы
- **Netlify**: поддерживает Next.js
- **Railway**: простой деплой для Node.js приложений
- **Heroku**: классический вариант для веб-приложений

## 📖 Полезные ресурсы

- [Telegram Mini Apps Docs](https://docs.telegram-mini-apps.com/)
- [Telegram Apps SDK](https://github.com/Telegram-Mini-Apps/telegram-apps)
- [Telegram UI Kit](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Частые проблемы

### Приложение не открывается в Telegram
- ✅ Проверьте, что URL использует HTTPS
- ✅ Убедитесь, что сертификат валидный
- ✅ Проверьте настройки бота в @BotFather

### Стили отображаются некорректно
- ✅ Убедитесь, что импортированы стили Telegram UI
- ✅ Проверьте CSS переменные темы Telegram

### Ошибки в консоли
- ✅ Проверьте инициализацию Telegram SDK
- ✅ Убедитесь, что все зависимости установлены

## 📄 Лицензия

MIT License - используйте код как хотите!

## 🤝 Вклад в проект

Если хотите улучшить приложение:
1. Создайте fork репозитория
2. Внесите изменения
3. Отправьте pull request

---

Сделано с ❤️ для изучения Telegram Mini Apps
