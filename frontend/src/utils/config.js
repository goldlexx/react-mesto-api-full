export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://api-mesto.goldlexx.ru';

export const API_BASE_URL_WITH_SLASH = `${API_BASE_URL.replace(/\/+$/, '')}/`;
