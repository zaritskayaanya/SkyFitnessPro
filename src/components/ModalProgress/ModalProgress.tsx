'use client';

import styles from './modalProgress.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  saveTrainProgress,
} from '../../servises/course/courseApi';
import BaseButton from '../Button/Button';
import {
  setCurrentProgress,
  setCompletedWorkoutForCourse,
} from '../../store/features/courseSlise';

export interface ExerciseType {
  _id: string;
  name: string;
  quantity: number;
}

export interface ModalProgressProps {
  courseId: string;
  workoutId: string;
  onClose: () => void;
  /** Вызывается после успешного сохранения — можно показать модалку «Ваш прогресс засчитан!» */
  onSuccess?: () => void;
  initialProgress: number[];
  exercises: ExerciseType[];
}

export default function ModalProgress({
  courseId,
  workoutId,
  onClose,
  onSuccess,
  initialProgress,
  exercises,
}: ModalProgressProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempProgress, setTempProgress] = useState<number[]>(initialProgress);

  useEffect(() => {
    setTempProgress(initialProgress);
  }, [initialProgress]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = parseInt(value, 10);
    const newProgress = [...tempProgress];
    newProgress[index] = isNaN(numericValue) ? 0 : numericValue;

    setTempProgress(newProgress);
  };

  const handleSave = async () => {
    if (!token) {
      setErrorMessage('Требуется авторизация.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await saveTrainProgress(
        courseId,
        workoutId,
        {
          progressData: tempProgress,
        },
        token,
      );

      dispatch(setCurrentProgress(tempProgress));
      if (res?.workoutCompleted) {
        dispatch(
          setCompletedWorkoutForCourse({ courseId, workoutId }),
        );
      }

      onClose();
      onSuccess?.();
    } catch {
      const msg = 'Не удалось сохранить прогресс. Проверьте формат данных.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <div className={styles.modal__form}>
            <button className={styles.modal__close} onClick={onClose}>
              X
            </button>
            <h4 className={styles.modal__title}>Мой прогресс</h4>
            <form className={styles.inputContainer}>
              {exercises && exercises.length > 0 ? (
                exercises.map((el, index) => (
                  <div key={el._id}>
                    <p className={styles.modal__label}>
                      Сколько раз вы сделали упражнение {el.name}? (Цель:{' '}
                      {el.quantity})
                    </p>
                    <input
                      className={styles.modal__input}
                      type="text"
                      min="0"
                      max={el.quantity}
                      placeholder="0"
                      value={tempProgress[index] ?? 0}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p>Ошибка: Цели упражнений не загружены.</p>
              )}
            </form>
            {errorMessage && (
              <p className={styles.errorText}>{errorMessage}</p>
            )}
            <BaseButton
              disabled={isLoading}
              onClick={handleSave}
              fullWidth={true}
              text={isLoading ? 'Сохранение...' : 'Сохранить прогресс'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}