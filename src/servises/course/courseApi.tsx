import { BASE_URL } from '../constants';
import {
  CourseTypes,
  ProgressWorkOutCourseTypes,
  ProgressWorkOutTypes,
  UserTypes,
  WorkOutTypes,
} from '../../sharedTyres/shared.Types';

/** Запрос с авторизацией: только Bearer, без Content-Type (как в рабочем проекте). */
async function fetchWithAuth<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message?: string }).message
        : `Ошибка запроса: ${response.status}`;
    throw new Error(message ?? `Ошибка ${response.status}`);
  }

  return data as T;
}

/** GET без авторизации */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message?: string }).message
        : `Ошибка ${response.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const getCourses = async (): Promise<CourseTypes[]> => {
  return fetchJson<CourseTypes[]>(`${BASE_URL}/api/fitness/courses`);
};

/** Формат ответа API: либо { email, selectedCourses }, либо { user: { email, selectedCourses } }. */
type UsersMeResponse =
  | { email?: string; selectedCourses?: string[] }
  | { user?: { email?: string; selectedCourses?: string[] } };

function getSelectedCoursesFromResponse(data: UsersMeResponse): string[] {
  const fromUser =
    data && typeof data === 'object' && 'user' in data && data.user
      ? (data.user as { selectedCourses?: string[] }).selectedCourses
      : undefined;
  const fromTop =
    data && typeof data === 'object' && 'selectedCourses' in data
      ? (data as { selectedCourses?: string[] }).selectedCourses
      : undefined;
  const arr = fromUser ?? fromTop;
  return Array.isArray(arr) ? arr : [];
}

function getEmailFromResponse(data: UsersMeResponse): string {
  const fromUser =
    data && typeof data === 'object' && 'user' in data && data.user
      ? (data.user as { email?: string }).email
      : undefined;
  const fromTop =
    data && typeof data === 'object' && 'email' in data
      ? (data as { email?: string }).email
      : undefined;
  return (fromUser ?? fromTop) ?? '';
}

/** GET /api/fitness/users/me — ответ API в разном формате, приводим к UserTypes. */
export const getCoursesMe = async (token: string): Promise<UserTypes> => {
  const data = await fetchWithAuth<UsersMeResponse>(
    '/api/fitness/users/me',
    token,
    { method: 'GET' },
  );
  return {
    user: {
      _id: '',
      email: getEmailFromResponse(data),
      selectedCourses: getSelectedCoursesFromResponse(data),
      courseProgress: [],
    },
  };
};

export const getCoursesId = async (courseId: string): Promise<CourseTypes> => {
  return fetchJson<CourseTypes>(`${BASE_URL}/api/fitness/courses/${courseId}`);
};

/**
 * Добавить курс для пользователя.
 * POST /api/fitness/users/me/courses
 * Как в рабочем проекте: при 500 сервер может всё равно добавить курс — считаем успехом.
 */
export const addCourseAPI = async (
  token: string,
  courseId: string,
): Promise<{ message?: string }> => {
  const response = await fetch(`${BASE_URL}/api/fitness/users/me/courses`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ courseId }),
  });

  if (response.status === 500) {
    await response.text().catch(() => {});
    return { message: 'Курс добавлен' };
  }

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message?: string }).message
        : `Ошибка запроса: ${response.status}`;
    throw new Error(message ?? `Ошибка ${response.status}`);
  }

  return (data as { message?: string }) ?? { message: 'Курс успешно добавлен!' };
};

export const removeCourseAPI = (token: string, courseId: string) => {
  return fetchWithAuth(
    `/api/fitness/users/me/courses/${courseId}`,
    token,
    { method: 'DELETE' },
  );
};

export const getWorkOutId = async (
  workoutId: string,
  token: string,
): Promise<WorkOutTypes> => {
  return fetchWithAuth<WorkOutTypes>(
    `/api/fitness/workouts/${workoutId}`,
    token,
    { method: 'GET' },
  );
};

export const getWorkOutList = async (
  courseId: string,
  token: string,
): Promise<WorkOutTypes[]> => {
  return fetchWithAuth<WorkOutTypes[]>(
    `/api/fitness/courses/${courseId}/workouts`,
    token,
    { method: 'GET' },
  );
};

export const removeCourseProgress = (token: string, courseId: string) => {
  return fetchWithAuth(
    `/api/fitness/courses/${courseId}/reset`,
    token,
    { method: 'PATCH' },
  );
};

export const getProgressCourse = async (
  courseId: string,
  token: string,
): Promise<ProgressWorkOutCourseTypes> => {
  return fetchWithAuth<ProgressWorkOutCourseTypes>(
    `/api/fitness/users/me/progress?courseId=${courseId}`,
    token,
    { method: 'GET' },
  );
};

export const getProgressTrain = async (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<ProgressWorkOutTypes> => {
  return fetchWithAuth<ProgressWorkOutTypes>(
    `/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
    token,
    { method: 'GET' },
  );
};

export const saveTrainProgress = (
  courseId: string,
  workoutId: string,
  progressPayload: { progressData: number[] },
  token: string,
): Promise<ProgressWorkOutTypes> => {
  return fetchWithAuth<ProgressWorkOutTypes>(
    `/api/fitness/courses/${courseId}/workouts/${workoutId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(progressPayload),
    },
  );
};

export const resetWorkoutProgress = (
  courseId: string,
  workoutId: string,
  token: string,
) => {
  return fetchWithAuth(
    `/api/fitness/courses/${courseId}/workouts/${workoutId}/reset`,
    token,
    { method: 'PATCH' },
  );
};

export const deleteAllCourseProgress = (courseId: string, token: string) => {
  return fetchWithAuth(
    `/api/fitness/courses/${courseId}/reset`,
    token,
    { method: 'PATCH' },
  );
};
