const TOKEN_KEY = 'promanage_pending_invitation';

export const invitationService = {
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  hasPendingInvitation: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};