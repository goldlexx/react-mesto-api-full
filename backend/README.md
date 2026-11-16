# Mesto API

The production Mesto API is a Cloudflare Worker backed by a dedicated Cloudflare D1 database.

## API

- `POST /signup` and `POST /signin`
- `GET /users`, `GET /users/me`, and `GET /users/:id`
- `PATCH /users/me` and `PATCH /users/me/avatar`
- `GET /cards`, `POST /cards`, and `DELETE /cards/:cardId`
- `PUT /cards/:cardId/likes` and `DELETE /cards/:cardId/likes`

Protected routes require a bearer JWT. Passwords are hashed with PBKDF2 through Web Crypto; the signing key is provided as the Cloudflare secret `JWT_SECRET`. Card images are stored as HTTP(S) links; this API does not upload files.

## Cloudflare Setup

`worker.js` is the production entry point. `wrangler.jsonc` defines the `DB` binding, and SQL migrations in `migrations/` create the user, card, and like tables. The production database is separate from other portfolio projects.

For local Worker development, install the backend dependencies and create a local `.dev.vars` file containing a development-only `JWT_SECRET`:

```text
JWT_SECRET=use-a-long-random-local-value
```

Then run:

```bash
npm ci
npx wrangler d1 migrations apply mesto-api-db --local
npm run cf:dev
```

For an authorized production maintenance session, `npm run cf:migrate` applies pending migrations and `npm run cf:deploy` publishes the Worker. Set the signing key through Wrangler secret management; never commit `.dev.vars`, keys, or tokens.

## Legacy Express Server

The original Express/Mongoose code remains available for local legacy development. It is not used by the deployed Worker. It requires a local MongoDB and `backend/.env` configured from `.env.example`.

The MongoDB integration tests can drop the selected database. Set `MONGODB_TEST_URI` only to a disposable database whose name ends in `_test`; never use a production URI.

## Project Background

The original API was created as part of the Yandex Practicum web development course; the Cloudflare Worker and D1 implementation was added later.
