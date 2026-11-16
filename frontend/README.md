# Mesto — React frontend

Mesto is a photo-sharing interface built with React. This repository contains the frontend; sign-in, profile, card, and image data require a compatible Mesto API.

## Run locally

```sh
git clone https://github.com/goldlexx/react-mesto-api-full.git
cd react-mesto-api-full/frontend
npm install
npm start
```

## API configuration

Set `REACT_APP_API_BASE_URL` to the base URL of a compatible Mesto backend before starting or building the app. It defaults to the API hostname historically configured for this project; that service is currently unavailable, so authentication and account-backed data may not work until a valid API is configured.

```sh
REACT_APP_API_BASE_URL=https://your-api.example npm start
```

The interface does not create demo accounts or substitute fake profile/card data.

## Build and test

```sh
npm test -- --watchAll=false
npm run build
```



