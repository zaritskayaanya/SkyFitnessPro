'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setMyCourseIds } from '../../store/features/courseSlise';
import { saveMyCourseIds } from '../../store/features/courseStorage';
import { getCoursesMe } from '../../servises/course/courseApi';

/**
 * При загрузке приложения подтягивает список «Мои курсы» с API.
 * Если API вернул список — обновляем стор и sessionStorage.
 * Если API вернул пустой список — не затираем сохранённые в sessionStorage курсы.
 */
export default function MyCoursesHydration() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!token || hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    getCoursesMe(token)
      .then((res) => {
        const serverIds = res.user?.selectedCourses ?? [];
        const ids = Array.isArray(serverIds) ? serverIds : [];
        if (ids.length > 0) {
          dispatch(setMyCourseIds(ids));
          saveMyCourseIds(ids);
        }
      })
      .catch(() => {
        hasFetchedRef.current = false;
      });
  }, [token, dispatch]);

  return null;
}
