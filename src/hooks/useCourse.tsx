import { useEffect, useRef, useState } from 'react';
import { CourseTypes } from '../sharedTyres/shared.Types';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addCourse, removeCourse, setMyCourseIds } from '../store/features/courseSlise';
import { saveMyCourseIds } from '../store/features/courseStorage';
import { addCourseAPI, removeCourseAPI } from '../servises/course/courseApi';
import { useModal } from '../context/ModalContext';
import { toast } from 'react-toastify';
import { loadAuthState } from '../store/features/authSrorage';

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleAddRemove: (e: React.MouseEvent<HTMLElement>) => void;
  isAdd: boolean;
};

export const useCourse = (
  course: CourseTypes | null,
  courseIdFromUrl?: string,
): returnTypeHook => {
  const { myCourses, myCourseIds, allCourses } = useAppSelector((state) => state.course);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { openLogin } = useModal();
  const myCourseIdsRef = useRef(myCourseIds);
  useEffect(() => {
    myCourseIdsRef.current = myCourseIds;
  }, [myCourseIds]);
  const effectiveCourseId = course?._id ?? courseIdFromUrl;
  const isAdd = myCourses.some((t) => t._id === effectiveCourseId);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleAddRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const authToken = token || (typeof window !== 'undefined' ? loadAuthState().token : '');
    if (!authToken) {
      openLogin();
      setErrorMsg('Нет авторизации');
      toast.info('Войдите в аккаунт, чтобы добавить курс');
      return;
    }

    const courseId = course?._id ?? courseIdFromUrl;
    if (!courseId) {
      toast.error('Курс не загружен. Обновите страницу.');
      return;
    }

    const actionApi = isAdd ? removeCourseAPI : addCourseAPI;
    const actionSlice = isAdd ? removeCourse : addCourse;
    const courseToUse = course ?? allCourses.find((c) => c._id === courseId) ?? null;

    setIsLoading(true);
    setErrorMsg(null);

    const isAdding = !isAdd;
    actionApi(authToken, courseId)
        .then(() => {
          if (courseToUse) {
            dispatch(actionSlice(courseToUse));
          }
          const currentIds = myCourseIdsRef.current;
          const nextIds = isAdding
            ? currentIds.includes(courseId)
              ? currentIds
              : [...currentIds, courseId]
            : currentIds.filter((id) => id !== courseId);
          dispatch(setMyCourseIds(nextIds));
          saveMyCourseIds(nextIds);
          toast.success(isAdding ? 'Курс добавлен в «Мои курсы»!' : 'Курс удалён.');
        })
        .catch((error) => {
          const msg = error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже';
          setErrorMsg(msg);
          toast.error(msg);
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  return {
    isLoading,
    errorMsg,
    toggleAddRemove,
    isAdd,
  };
};