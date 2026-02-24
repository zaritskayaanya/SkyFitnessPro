import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store/store';
import { useEffect } from 'react';
import {
  setCurrentProgressCourse,
  setFetchError,
  setFetchIsLoading,
  setMyCourseIds,
  setMyCourses,
} from '../store/features/courseSlise';
import { saveMyCourseIds } from '../store/features/courseStorage';
import { getCoursesMe, getProgressCourse } from '../servises/course/courseApi';
import { ProgressWorkOutCourseTypes } from '../sharedTyres/shared.Types';

export const useMyCoursesDataAndProgress = () => {
  const dispatch = useDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const {
    myCourseIds,
    fetchIsLoading,
    courseProgress,
    allCourses,
  } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (!token || fetchIsLoading || myCourseIds.length > 0) {
      return;
    }

    dispatch(setFetchIsLoading(true));
    getCoursesMe(token)
      .then((res) => {
        const serverIds = res.user.selectedCourses ?? [];
        const merged = Array.from(new Set([...myCourseIds, ...serverIds]));
        dispatch(setMyCourseIds(merged));
        saveMyCourseIds(merged);
      })
      .catch(() => {
        dispatch(setFetchError('Ошибка загрузки списка курсов'));
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- загрузка только при пустом myCourseIds
  }, [dispatch, token, myCourseIds.length, fetchIsLoading]);


  useEffect(() => {
    if (myCourseIds.length > 0 && allCourses.length > 0) {
      const filteredCourses = allCourses.filter((course) =>
        myCourseIds.includes(course._id),
      );
      dispatch(setMyCourses(filteredCourses));
    }
  }, [myCourseIds, allCourses, dispatch]);


  useEffect(() => {
    if (myCourseIds.length === 0 || !token) {
      return;
    }

    myCourseIds.forEach((courseId) => {
      if (!courseProgress[courseId]) {
        getProgressCourse(courseId, token)
          .then((res: ProgressWorkOutCourseTypes) => {
            const formattedProgress: ProgressWorkOutCourseTypes = {
              courseId,
              courseCompleted: res.courseCompleted,
              workoutsProgress: res.workoutsProgress,
            };

            dispatch(
              setCurrentProgressCourse({
                courseId: courseId,
                progress: formattedProgress,
              }),
            );
          })
          .catch(() => {});
      }
    });
  }, [myCourseIds, token, dispatch, courseProgress]);

  const coursesWithProgress = useAppSelector((state) => {
    return state.course.myCourses.map((course) => ({
      ...course,
      progress: courseProgress[course._id] || {
        courseCompleted: false,
        workoutsProgress: [],
      },
    }));
  });

  return { coursesWithProgress };
};