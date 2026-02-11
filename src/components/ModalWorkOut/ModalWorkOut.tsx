'use client';

import styles from './modalWorkOut.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getWorkOutList } from '../../servises/course/courseApi';
import BaseButton from '../Button/Button';
import { WorkOutTypes } from '../../sharedTyres/shared.Types';
import { useRouter } from 'next/navigation';
import { setWorkouts } from '../../store/features/courseSlise';

export interface ModalWorkOutProps {
  courseId: string;
  onClose: () => void;
}
export default function ModalWorkOut({ courseId, onClose }: ModalWorkOutProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const { workouts, completedWorkoutsByCourse } = useAppSelector(
    (state) => state.course,
  );
  const completedWorkout = completedWorkoutsByCourse[courseId] ?? [];

  const sortedWorkouts = [...workouts].sort((a, b) => {
    const getLessonNumber = (name: string): number => {
      const match = name.match(/Урок\s+(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    
    return getLessonNumber(a.name) - getLessonNumber(b.name);
  });

  useEffect(() => {
    if (!courseId || !token) {
      return;
    }

    getWorkOutList(courseId, token)
      .then((res: WorkOutTypes[]) => {
        dispatch(setWorkouts(res));
        if (res.length > 0) {
          setSelectedWorkoutId(res[0]._id);
        }
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, token, dispatch]);

  const onSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedWorkoutId) {
      setErrorMessage('Сначала выберите тренировку.');
      return;
    }
    router.push(
      `/allCourses/courses/${courseId}/workouts/${selectedWorkoutId}`,
    );
  };

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <button className={styles.modal__close} onClick={onClose}>
              X
            </button>
            <h3 className={styles.modal__title}>Выберите тренировку</h3>

            <div className={styles.inputContainer}>
              {isLoading ? (
                <span style={{ color: 'white' }}>Загрузка тренировок...</span>
              ) : workouts.length === 0 ? (
                <p>Тренировок нет.</p>
              ) : (
                sortedWorkouts.map((workout) => {
                  const isSelected = selectedWorkoutId === workout._id;
                  const isCompleted = completedWorkout.includes(workout._id);

                  const itemClassName = [
                    styles.workoutItem,
                    isSelected ? styles.selectedItem : '',
                    isCompleted ? styles.completed : '',
                  ].join(' ');

                  return (
                    <label
                      key={workout._id}
                      className={itemClassName}
                      htmlFor={`workout-${workout._id}`}
                    >
                      <input
                        type="radio"
                        id={`workout-${workout._id}`}
                        name="selectedWorkout"
                        value={workout._id}
                        checked={isSelected}
                        onChange={() => setSelectedWorkoutId(workout._id)}
                        className={`${styles.workoutInput} ${isCompleted ? styles.completed : ''}`}
                        disabled={isCompleted}
                      />

                      <div className={styles.customIndicator}></div>

                      <div className={styles.workoutLabel}>
                        <span className={styles.workoutName}>
                          {workout.name}
                        </span>
                        <span className={styles.workoutSubtitle}></span>
                      </div>
                    </label>
                  );
                })
              )}
              <div className={styles.errorContainer}>{errorMessage}</div>
            </div>
            <BaseButton
              disabled={isLoading || !selectedWorkoutId}
              onClick={onSubmit}
              fullWidth={true}
              text="Начать"
            />
          </form>
        </div>
      </div>
    </div>
  );
}