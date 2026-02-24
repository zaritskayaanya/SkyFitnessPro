import { AuthState } from './authSlice';
import { clearMyCourseIds } from './courseStorage';

const SESSION_KEY = 'sky_fitness_auth';

/**
 * Загрузить сохранённую авторизацию при инициализации (в т.ч. после обновления страницы).
 * Используется sessionStorage — сессия живёт до закрытия вкладки.
 */
export const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: '', token: '' };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { user: '', token: '' };
    const data = JSON.parse(raw) as { user?: string; token?: string };
    const user = typeof data.user === 'string' ? data.user : '';
    const token = typeof data.token === 'string' ? data.token : '';
    if (token && user) return { user, token };
  } catch {
    // ignore
  }
  return { user: '', token: '' };
};

/** Сохранить авторизацию в sessionStorage (после входа/регистрации). */
export const saveAuthState = (user: string, token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
  } catch {
    // ignore
  }
};

/** Очистить сохранённую сессию и список курсов (при выходе). */
export const clearAuthState = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    clearMyCourseIds();
  } catch {
    // ignore
  }
};
