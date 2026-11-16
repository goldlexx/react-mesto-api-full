const checkResponse = async (response) => {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status}).`);
  }

  if (response.status !== 204 && data === null) {
    throw new Error('The API returned an unreadable response.');
  }

  return data;
};

export default checkResponse;
