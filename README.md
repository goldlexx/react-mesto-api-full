# Проект "Mesto фронтенд + бэкенд". Создана в рамках учебы в [Яндекс.Практикум](https://praktikum.yandex.ru/) на курсе ["Веб-разработчик"](https://praktikum.yandex.ru/web/).

## Описание:

Репозиторий для приложения проекта `Mesto`, включающий фронтенд и бэкенд части приложения со следующими возможностями: авторизации и регистрации пользователей, операции с карточками и пользователями.

| **Публичный домен** | [Mesto](https://mesto.travel.nomoredomains.sbs/) |
| ----------------- | -------------------------------------------------------------------- |

API реализован с валидацией запросов, логированием запросов и ошибок, централизованной обработкой ошибок и доступен по [этой](https://api.mesto.travel.nomoredomains.sbs/) ссылке.

Публичный IP-адрес сервера: 51.250.4.79

## Примененные знания
* Верстка
  - Соверменная верстка с использованием Flexbox и Grid Layout
  - Семантическая верстка
  - Адаптивная верстка сайта для разных экранов (от 320 до 1280+)
  - Верстка форм (текстовые поля и кнопки)
  - Методология БЭМ

* React
  - использование Create React App
  - хуки `useState` и `useEffect`
  - поднятие стейта
  - глобальный стейт через React Context
  - управляемые компоненты в элементах формы
  - использование реф для прямого доступа к DOM-элементам

* React Router
  - реализован функционал  регистрации и авторизации
  - защищенные маршруты
  - авторизация через JWT
  - работа с Local Starage

* Бэкенд
  - Node.js
  - express.js
  - MongoDB
  - Mongoose

### Инструкция по разрёртыванию проекта:
```bash
# клонирование репозитория
$ git clone https://github.com/goldlexx/react-mesto-api-full.git

# установка зависимостей
$ npm install

# запуск develop-сборки фронтенда
$ npm run start

# Запуск develop-сборки бэкенда
$ npm run dev
```











