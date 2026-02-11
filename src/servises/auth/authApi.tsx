import { BASE_URL } from '../constants';

interface authUserForm {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

/**
 * Авторизация пользователя.
 * POST /api/fitness/auth/login
 * Как в рабочем проекте: fetch без Content-Type, только body: JSON.stringify(...)
 */
export const authUser = async (
  data: authUserForm,
): Promise<AuthUserResponse> => {
  const response = await fetch(`${BASE_URL}/api/fitness/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: data.email.trim(),
      password: data.password,
    }),
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      typeof resData?.message === 'string'
        ? resData.message
        : 'Ошибка входа';
    throw new Error(msg);
  }

  return resData as AuthUserResponse;
};

/**
 * Регистрация пользователя.
 * POST /api/fitness/auth/register
 * fetch без Content-Type.
 */
export const regUser = async ({
  email,
  password,
}: authUserForm): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/api/fitness/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      typeof resData?.message === 'string'
        ? resData.message
        : 'Ошибка регистрации';
    throw new Error(msg);
  }

  return resData as RegisterResponse;
};

/** Для совместимости, если где-то вызывают getToken */
export const getToken = async (
  data: authUserForm,
): Promise<AuthUserResponse> => {
  return authUser(data);
};
