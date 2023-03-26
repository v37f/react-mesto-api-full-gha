import { BASE_URL } from './Constants';
/**
 * Класс для взаимодействия с сервером
 */
class Api {
   /**
   * @constructor
   * @param {object} options Настройки API
   */
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  /**
   * Проверяет ответ сервера на запрос (успешен/неуспешен)
   * @param {Response} response Ответ сервера на запрос
   * @returns {Promise} Если ответ с сервера успешен возвращает
   * промис с данными. Если ответ неуспешен возвращает отклоненный
   * промис с номером ошибки
   */
  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(`Ошибка: ${response.status}`);
    }
  }

   /**
   * Посылает запрос и проверяет ответ сервера
   * @param {string} url URL-запроса
   * @param {Object} options Параметры запроса
   * @returns {Promise} Если ответ с сервера успешен возвращает
   * промис с данными. Если ответ неуспешен возвращает отклоненный
   * промис с номером ошибки
   */
  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  /**
   * Получает данные пользователя с сервера
   * @returns {Promise} Ответ от сервера с данными пользователя
   */
  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
        headers: this._headers
    })
  }

  /**
   * Получает карточки с сервера
   * @returns {Promise} Ответ от сервера с массивом карточек
   */
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers
  })
  }

  /**
   * Обновляет на сервере данные пользователя
   * @returns {Promise} Ответ от сервера с обновленными данными пользователя
   */
  updateUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
  }

  /**
   * Обновляет аватар пользователя
   * @returns {Promise} Ответ от сервера с обновленными данными пользователя
   */
   updateAvatar(avatarLink) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatarLink,
      })
    })
  }

  /**
   * Добавляет новую карточку на сервер
   * @returns {Promise} Ответ от сервера с объектом новой карточки
   */
   addCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
  }

  /**
   * Удаляет карточку с сервера
   * @returns {Promise} Ответ от сервера
   */
  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  /**
   * Ставит или убирает лайк карточке
   * @returns {Promise} Ответ от сервера с обновленным объектом карточки
   */
  changeLikeCardStatus(cardId, isLiked) {
    let requestMethod = 'PUT';
    if (isLiked) {
      requestMethod = 'DELETE';
    }
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: requestMethod,
      headers: this._headers,
    })
  }

  /**
   * Назначает api токен
   */
  setToken() {
    this._headers.authorization = `Bearer ${localStorage.getItem('jwt')}`
  };
}

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
});

export default api;
