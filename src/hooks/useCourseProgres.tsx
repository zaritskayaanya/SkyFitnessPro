'use client';

import { useMemo } from 'react';
import { useAppSelector } from '../store/store';

/**
 * Прогресс только по одному курсу: процент завершённых тренировок.
 * @param courseId — id курса
 * @param totalWorkoutsCount — количество тренировок в курсе (например, course.workouts.length)
 */
export const useCourseProgress = (
  courseId: string | undefined,
  totalWorkoutsCount: number,
): number => {
  const courseProgress = useAppSelector(
    (state) => state.course.courseProgress,
  );

  return useMemo((): number => {
    if (!courseId || totalWorkoutsCount <= 0) return 0;

    const progress = courseProgress[courseId];
    if (!progress) return 0;
    if (progress.courseCompleted) return 100;

    const workoutsProgress = progress.workoutsProgress;
    if (!workoutsProgress || !Array.isArray(workoutsProgress)) return 0;

    const completedCount = workoutsProgress.filter(
      (w) => w.workoutCompleted === true,
    ).length;
    return Math.min(100, Math.round((completedCount / totalWorkoutsCount) * 100));
  }, [courseId, totalWorkoutsCount, courseProgress]);
};