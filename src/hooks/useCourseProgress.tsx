'use client';

import { useMemo } from 'react';
import { useAppSelector } from '../store/store';

export const useCourseProgress = () => {
  const { currentProgressCourse, workouts, completedStatus } = useAppSelector(
    (state) => state.course,
  );

  const finalPercentage = useMemo(() => {
    if (completedStatus === true) {
      return 100;
    }

    // 1. Расчет общей цели
    const totalPotentialValue = workouts.reduce((total, workout) => {
      if (!workout || !workout.exercises) {
        return total;
      }
      const workoutGoalSum = workout.exercises.reduce((sum, exercise) => {
        return sum + exercise.quantity;
      }, 0);
      return total + workoutGoalSum;
    }, 0);

    if (totalPotentialValue === 0) {
      return 0;
    }

    // 2. Расчет факта
    let totalCompletedValue = 0;

    if (currentProgressCourse && currentProgressCourse.length > 0) {
      currentProgressCourse.forEach((courseProgressItem) => {
        if (courseProgressItem.workoutsProgress) {
          courseProgressItem.workoutsProgress.forEach((progressItem) => {
            if (
              progressItem.progressData &&
              Array.isArray(progressItem.progressData)
            ) {
              progressItem.progressData.forEach((completedAmount) => {
                totalCompletedValue += completedAmount;
              });
            }
          });
        }
      });
    }

    // 3. Финальный расчет
    const percentage = (totalCompletedValue / totalPotentialValue) * 100;

    return Math.min(100, Math.round(percentage));
  }, [workouts, currentProgressCourse, completedStatus]);

  return finalPercentage;
};