class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  _getAuthHeader() {
    const jwt = localStorage.getItem('jwt');
    return jwt ? { Authorization: `Bearer ${jwt}` } : {};
  }


  checkError(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getUserInfo() {
    return fetch(`${this._url}users/me`, {
      method: 'GET',
      headers: { ...this._headers, ...this._getAuthHeader() },
    }).then((res) => {
      return this.checkError(res);
    });
  }

  setUserInfo(data) {
    return fetch(`${this._url}users/me`, {
      method: 'PATCH',
      headers: { ...this._headers, ...this._getAuthHeader() },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => {
      return this.checkError(res);
    });
  }

  getCardList() {
    return fetch(`${this._url}cards`, {
      method: 'GET',
      headers: { ...this._headers, ...this._getAuthHeader() },
    }).then((res) => {
      return this.checkError(res);
    });
  }

  addNewCard(data) {
    return fetch(`${this._url}cards`, {
      method: 'POST',
      headers: { ...this._headers, ...this._getAuthHeader() },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => {
      return this.checkError(res);
    });
  }

  deleteCard(cardId) {
    return fetch(`${this._url}cards/${cardId}`, {
      method: 'DELETE',
      headers: { ...this._headers, ...this._getAuthHeader() },
    }).then((res) => {
      return this.checkError(res);
    });
  }

  addLikeCard(id) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: 'PUT',
      headers: { ...this._headers, ...this._getAuthHeader() },
    }).then((res) => {
      return this.checkError(res);
    });
  }

  removeLikeCard(id) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: 'DELETE',
      headers: { ...this._headers, ...this._getAuthHeader() },
    }).then((res) => {
      return this.checkError(res);
    });
  }

  setUserAvatar(data) {
    return fetch(`${this._url}users/me/avatar`, {
      method: 'PATCH',
      headers: { ...this._headers, ...this._getAuthHeader() },
      body: JSON.stringify({
        avatar: data,
      }),
    }).then((res) => {
      return this.checkError(res);
    });
  }
}

const api = new Api({
  url: 'https://api.mesto.travel.nomoredomains.sbs/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
