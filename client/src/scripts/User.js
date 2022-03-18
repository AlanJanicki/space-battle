import jwt_decode from 'jwt-decode';

export class User {
  static #user = null;

  static removeUserData() {
    this.#user = null;
    localStorage.removeItem('jwt');
  }

  static isUserTokenValid() {
    if (localStorage.getItem('jwt')) {
      const decodedToken = jwt_decode(localStorage.getItem('jwt'));
      if (decodedToken.exp * 1000 > Date.now()) {
        this.#user = decodedToken;
      } else {
        this.#user = null;
      }
    }
    return this.#user;
  }

  static get userData() {
    return this.#user;
  }

  static set userData(user) {
    this.#user = user;
    localStorage.setItem('jwt', this.#user.token);
  }
}
