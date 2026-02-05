import axios from 'axios';
import { BASE_URL } from '../constants';
import {
  CourseTypes,
  ProgressWorkOutCourseTypes,
  ProgressWorkOutTypes,
  UserTypes,
  WorkOutTypes,
} from '../../sharedTyres/shared.Types';

interface authUserForm {
  email: string;
  password: string;
}

interface TokenType {
  token: string;
}

export const getToken = async ({
  email,
  password,
}: authUserForm): Promise<TokenType> => {
  const res = await axios.post(
    BASE_URL + '/api/fitness/auth/login',
    { email, password },
    {
      headers: { 'Content-Type': '' },
    },
  );
  const token = res.data;
  return token;
};

export const getCourses = async (): Promise<CourseTypes[]> => {
  const res = await axios.get(BASE_URL + '/api/fitness/courses');
  return res.data;
};

export const getCoursesMe = async (token: string): Promise<UserTypes> => {
  const res = await axios.get(BASE_URL + `/api/fitness/users/me`, {
    headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getCoursesId = async (courseId: string): Promise<CourseTypes> => {
  const res = await axios.get(
    BASE_URL + `/api/fitness/courses/${courseId}`,
    {},
  );
  return res.data;
};

export const addCourseAPI = (token: string, courseId: string) => {
  return axios.post(
    BASE_URL + `/api/fitness/users/me/courses`,
    { courseId },
    {
      headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
    },
  );
};

export const removeCourseAPI = (token: string, courseId: string) => {
  return axios.delete(BASE_URL + `/api/fitness/users/me/courses/${courseId}`, {
    headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
  });
};

//Получить список тренировок курса.
export const getWorkOutId = async (
  workoutId: string,
  token: string,
): Promise<WorkOutTypes> => {
  const res = await axios.get(BASE_URL + `/api/fitness/workouts/${workoutId}`, {
    headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//Получить данные по тренировке
export const getWorkOutList = async (
  courseId: string,
  token: string,
): Promise<WorkOutTypes[]> => {
  const res = await axios.get(
    BASE_URL + `/api/fitness/courses/${courseId}/workouts`,
    {
      headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

//Удалить весь прогресс по курсу.
export const removeCourseProgress = (token: string, courseId: string) => {
  return axios.patch(BASE_URL + `/api/fitness/courses/${courseId}/reset`, {
    headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
  });
};

//Получить прогресс пользователя по всему курсу.
export const getProgressCourse = async (
  courseId: string,
  token: string,
): Promise<ProgressWorkOutCourseTypes> => {
  const res = await axios.get(
    BASE_URL + `/api/fitness/users/me/progress?courseId=${courseId}`,
    {
      headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

//Получить прогресс пользователя по тренировке.
export const getProgressTrain = async (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<ProgressWorkOutTypes> => {
  const res = await axios.get(
    BASE_URL +
      `/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
    {
      headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

//Сохранить прогресс тренировки.
export const saveTrainProgress = (
  courseId: string,
  workoutId: string,
  progressPayload: { progressData: number[] },
  token: string,
): Promise<ProgressWorkOutTypes> => {
  return axios.patch(
    BASE_URL + `/api/fitness/courses/${courseId}/workouts/${workoutId}`,
    progressPayload,
    {
      headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
    },
  );
};

//Удалить весь прогресс по курсу.
export const deleteAllCourseProgress = (
  courseId: string,
  token: string,
) => {
  return axios.patch(BASE_URL + `/api/fitness/courses/${courseId}/reset`, {
    headers: { 'Content-Type': '', Authorization: `Bearer ${token}` },
  });
};