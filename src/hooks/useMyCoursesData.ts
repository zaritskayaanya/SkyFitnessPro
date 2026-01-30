import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store/store';
import { useEffect } from 'react';
import {
  setCourseProgress, 
  setFetchError,
  setFetchIsLoading,
  setMyCourseIds,
  setMyCourses,
} from '../store/features/courseSlise';
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
        dispatch(setMyCourseIds(res.user.selectedCourses));
      })
      .catch((err) => {
        dispatch(setFetchError('Ошибка загрузки списка курсов'));
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
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
              courseId: courseId, 
              courseCompleted: res.courseCompleted,
              workoutsProgress: res.workoutsProgress,
            };

            dispatch(
              setCourseProgress({
                courseId: courseId,
                progress: formattedProgress,
              }),
            );
          })
          .catch((error) => {
            console.error(
              `Error fetching progress for course ${courseId}`,
              error,
            );
          });
      }
    });
  }, [myCourseIds, token, dispatch, courseProgress]);

  const coursesWithProgress = useAppSelector((state) => {
    return state.course.myCourses.map((course) => ({
      ...course,
      progress: courseProgress[course._id] || {
        courseId: course._id,
        courseCompleted: false,
        workoutsProgress: [],
      },
    }));
  });

  return { coursesWithProgress };
};