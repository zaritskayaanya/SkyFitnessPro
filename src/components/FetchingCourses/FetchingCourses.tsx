'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { AxiosError } from 'axios';
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
          if (err instanceof AxiosError) {
            if (err.response) {
              setFetchError(err.response.data.message);
            } else if (err.request) {
              setFetchError('Что-то с интернетом');
            } else {
              console.log('error:', err);
              setFetchError('Неизвестная ошибка');
            }
          }
        })
        .finally(() => {
          dispatch(setFetchIsLoading(false));
        });
    }
  }, []);

  return <></>;
}