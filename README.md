# Mesto Full-stack

A photo-sharing application with account registration, profile editing, photo cards, and likes.

## Live Demo

- [Mesto website](https://goldlexx.github.io/react-mesto-api-full/)
- [Mesto API Worker](https://mesto-api.rustik-yuldashev.workers.dev)

## Features

- Register and sign in with JWT authentication
- View and update a user profile and avatar URL
- Create photo cards, like or unlike cards, and delete your own cards
- Store account, card, and like data in Cloudflare D1

## Tech Stack

- React 18, React Router, and Create React App
- Cloudflare Workers and D1
- Web Crypto API for password hashing and JWT signing
- Legacy Express/MongoDB implementation retained for local development

## Project Structure

```text
frontend/  React client
backend/   Cloudflare Worker, D1 schema, and legacy Express API
```

## Getting Started

Run the frontend locally:

```bash
cd frontend
npm ci
npm start
```

The client uses the deployed Mesto Worker by default. Set `REACT_APP_API_BASE_URL` before starting the app if you need to use another compatible API.

The production Worker and D1 configuration are documented in [backend/README.md](backend/README.md). The retained Express server is a separate legacy option and requires a local MongoDB plus `backend/.env` configured from `.env.example`.

The MongoDB integration suite may drop the database named by `MONGODB_TEST_URI`. Use only a disposable database whose name ends in `_test`; never point it at production or user data.

## Project Background

The original Mesto interface was created as a learning project during the Yandex Practicum web development course; the Cloudflare Worker and D1 backend were added later.
