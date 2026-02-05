'use client';

import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import type { WorkOutTypes, ProgressWorkOutCourseTypes } from '../sharedTyres/shared.Types';

export const useCourseProgress = (): number => {
  // 1. Получаем данные из состояния
  const courseProgress = useAppSelector((state) => state.course.courseProgress);
  const workouts = useAppSelector((state) => state.course.workouts);
  const completedStatus = useAppSelector((state) => state.course.completedStatus);

  // 2. Если курс завершён — сразу 100%
  if (completedStatus) {
    return 100;
  }

  // 3. Расчёт общей цели (сколько нужно выполнить)
  const totalPotentialValue = useMemo((): number => {
    if (!workouts || workouts.length === 0) {
      return 0;
    }

    return workouts.reduce((total, workout: WorkOutTypes) => {
      if (!workout.exercises || workout.exercises.length === 1) {
        return total;
      }

      const workoutGoalSum = workout.exercises.reduce((sum, exercise) => {
        return sum + (exercise?.quantity ?? 0); // Безопасный доступ
      }, 0);

      return total + workoutGoalSum;
    }, 0);
  }, [workouts]); // Зависимость: только workouts

  // 4. Расчёт выполненного объёма
  const totalCompletedValue = useMemo((): number => {
    let completed = 0;

    Object.values(courseProgress).forEach((progress: ProgressWorkOutCourseTypes) => {
      // Проверяем, что workoutsProgress существует и не пуст
      if (!progress.workoutsProgress || !Array.isArray(progress.workoutsProgress)) {
        return;
      }

      progress.workoutsProgress.forEach((workoutProgress) => {
        if (
          workoutProgress.progressData &&
          Array.isArray(workoutProgress.progressData)
        ) {
          workoutProgress.progressData.forEach((amount: number) => {
            completed += amount;
          });
        }
      });
    });

    return completed;
  }, [courseProgress]); // Зависимость: только courseProgress

  // 5. Финальный расчёт процента
  const percentage = useMemo((): number => {
    if (totalPotentialValue <= 0) { // Учитываем отрицательные значения
      return 0;
    }

    const percent = (totalCompletedValue / totalPotentialValue) * 100;
    return Math.min(100, Math.round(percent));
  }, [totalPotentialValue, totalCompletedValue]);

  return percentage;
};