const TOKEN_KEY = 'hadir_in_access_token';

export const AUTH_UNAUTHORIZED_EVENT = 'hadir-in:unauthorized';

export const tokenStorage = {
  get() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  set(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  remove() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};
