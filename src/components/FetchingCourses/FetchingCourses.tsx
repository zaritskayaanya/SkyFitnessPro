'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setAllCourses,
  setFetchError,
  setFetchIsLoading,
} from '../../store/features/courseSlise';
import { getCourses } from '../../servises/course/courseApi';

export default function FetchingCourses() {
  const dispatch = useAppDispatch();
  const { allCourses } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (allCourses.length) {
      dispatch(setAllCourses(allCourses));
    } else {
      dispatch(setFetchIsLoading(true));
      getCourses()
        .then((res) => {
          dispatch(setAllCourses(res));
        })
        .catch((err) => {
          dispatch(
            setFetchError(err instanceof Error ? err.message : 'Неизвестная ошибка'),
          );
        })
        .finally(() => {
          dispatch(setFetchIsLoading(false));
        });
    }
  }, [allCourses, dispatch]);

  return <></>;
}