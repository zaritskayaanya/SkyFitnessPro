import { useState } from 'react';
import { CourseTypes } from '../sharedTyres/shared.Types';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addCourse, removeCourse } from '../store/features/courseSlise';
import { AxiosError } from 'axios';
import { addCourseAPI, removeCourseAPI } from '../servises/course/courseApi';
import { useModal } from '../context/ModalContext';

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleAddRemove: (e: React.MouseEvent<HTMLElement>) => void;
  isAdd: boolean;
};

export const useCourse = (course: CourseTypes | null): returnTypeHook => {
  const { myCourses } = useAppSelector((state) => state.course);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { openLogin } = useModal();
  const isAdd = myCourses.some((t) => t._id === course?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleAddRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!token) {
      openLogin();
      return setErrorMsg('Нет авторизации');
    }

    const actionApi = isAdd ? removeCourseAPI : addCourseAPI;
    const actionSlice = isAdd ? removeCourse : addCourse;

    setIsLoading(true);
    setErrorMsg(null);

    if (course) {
      actionApi(token, course._id)
        .then(() => {
          dispatch(actionSlice(course));
          alert('Успешно!');
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response) {
              setErrorMsg(error.response.data.message);
            } else if (error.request) {
              setErrorMsg('Произошла ошибка. Попробуйте позже');
            } else {
              setErrorMsg('Неизвестная ошибка');
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return {
    isLoading,
    errorMsg,
    toggleAddRemove,
    isAdd,
  };
};