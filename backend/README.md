[![Tests](https://github.com/goldlexx/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект "Mesto бэкенд". Создана в рамках учебы в [Яндекс.Практикум](https://praktikum.yandex.ru/) на курсе ["Веб-разработчик"](https://praktikum.yandex.ru/web/).

## Используемые технологии
- Node.js
- express.js
- MongoDB
- Mongoose

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Cloudflare Workers + D1

Production API runs from `worker.js`; its D1 binding and database migrations are configured in `wrangler.jsonc` and `migrations/`. The frontend uses the Worker URL by default. The Worker secret `JWT_SECRET` is managed with Wrangler and must never be committed.

- `npm run cf:dev` — run the Worker locally.
- `npm run cf:migrate` — apply D1 migrations to the configured remote database.
- `npm run cf:deploy` — deploy the Worker.

Set or rotate the JWT secret with `wrangler secret put JWT_SECRET` from this directory. Keep the existing Express/MongoDB files for local legacy development; they are not used by the Cloudflare deployment.




