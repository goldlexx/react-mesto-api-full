export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://mesto-api.rustik-yuldashev.workers.dev';

export const API_BASE_URL_WITH_SLASH = `${API_BASE_URL.replace(/\/+$/, '')}/`;
