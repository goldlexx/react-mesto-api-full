<div align="center">

# 📷 Mesto Full-stack

Full-stack приложение для публикации фотографий, профиля пользователя и лайков.

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=111)](https://react.dev/) [![Cloudflare Workers](https://img.shields.io/badge/API-Cloudflare%20Workers-f38020?logo=cloudflare&logoColor=fff)](https://workers.cloudflare.com/) [![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-222?logo=github)](https://goldlexx.github.io/react-mesto-api-full/)

</div>

## Возможности

- регистрация, вход и JWT-авторизация;
- редактирование профиля и аватара;
- добавление и удаление карточек;
- лайки с проверкой владельца.

## Демонстрация

- [Сайт Mesto](https://goldlexx.github.io/react-mesto-api-full/)
- [API Worker](https://mesto-api.rustik-yuldashev.workers.dev)

## Архитектура

Frontend работает с отдельным Cloudflare Worker. Данные пользователей и карточек хранятся в Cloudflare D1; пароли обрабатываются на backend.

## Установка и запуск

Инструкции frontend и backend находятся в соответствующих каталогах проекта. Production-секреты не коммитятся.

## Технологии

React, JavaScript, Cloudflare Workers, D1, Web Crypto, JWT.

## Лицензия

Лицензия в репозитории не указана.
