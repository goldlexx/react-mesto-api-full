# Mesto Full-stack

A photo-sharing application with user registration, authentication, profile editing, and photo-card interactions.

## Features

- Register and sign in with JWT authentication
- View and update profile details and avatar
- Create, like, unlike, and delete photo cards
- Validate request data and handle API errors centrally

## Stack

React 18, React Router, Node.js, Express, MongoDB, Mongoose, JWT, Celebrate/Joi.

## Structure

```text
frontend/  React client
backend/   Express API and MongoDB models
```

## Screenshot

![Mesto sign-in screen](screenshots/local-home.jpg)

The screenshot shows the locally launched sign-in page. The legacy public deployment was unavailable during the previous check, so an authenticated live feed could not be confirmed.

## Run locally

Install and run a local MongoDB instance. Create `backend/.env` from `backend/.env.example`; set a random `JWT_SECRET` of at least 32 characters and a local `DATABASE_URL`.

```bash
cd backend
npm ci
npm run dev
```

In another terminal:

```bash
cd frontend
npm ci
npm start
```

The frontend API URL is configured in its utility modules. Change the local URL configuration if you are connecting it to the local API instead of the original course service.

## Tests

The backend integration suite is `backend/test/api.integration.test.js`. Set `MONGODB_TEST_URI` to a disposable database whose name ends in `_test`, then run:

```bash
cd backend
npm test
```

The suite drops the selected test database before and after its run. Never point `MONGODB_TEST_URI` at a working or production database. Without this variable, the integration suite is skipped.

## API routes

- `POST /signup` and `POST /signin`
- `GET /users`, `GET /users/me`, and profile update routes
- `GET /cards`, `POST /cards`, and card operations under `/cards/:cardId`

The API requires `JWT_SECRET` and `DATABASE_URL` from the environment; it has no built-in secret fallback.
