'use client';

import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import type { WorkOutTypes, ProgressWorkOutCourseTypes } from '../sharedTyres/shared.Types';

export const useCourseProgress = (): number => {
  const courseProgress = useAppSelector((state) => state.course.courseProgress);
  const workouts = useAppSelector((state) => state.course.workouts);
  const completedStatus = useAppSelector((state) => state.course.completedStatus);

  if (completedStatus) {
    return 100;
  }

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
  }, [workouts]); 

  const totalCompletedValue = useMemo((): number => {
    let completed = 0;

    Object.values(courseProgress).forEach((progress: ProgressWorkOutCourseTypes) => {
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
  }, [courseProgress]); 

  const percentage = useMemo((): number => {
    if (totalPotentialValue <= 0) { 
      return 0;
    }

    const percent = (totalCompletedValue / totalPotentialValue) * 100;
    return Math.min(100, Math.round(percent));
  }, [totalPotentialValue, totalCompletedValue]);

  return percentage;
};
