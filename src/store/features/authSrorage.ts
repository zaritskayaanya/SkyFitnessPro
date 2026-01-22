import { AuthState } from './authSlice';

export const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: "", token: "" };
  }

  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && user) {
      return { user: user, token: token };
    }

    return { user: "", token: "" };
  } catch (error) {
    console.error('Error reading auth state:', error);
    return { user: "", token: "" };
  }
};
