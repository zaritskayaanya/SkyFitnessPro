'use client';

import styles from './modalProgress.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  saveTrainProgress,
} from '../../servises/course/courseApi';
import BaseButton from '../Button/Button';
import { setCurrentProgress } from '../../store/features/courseSlise';

export interface ExerciseType {
  _id: string;
  name: string;
  quantity: number;
}

export interface ModalWorkOutProps {
  courseId: string;
  workoutId: string;
  onClose: () => void;
  initialProgress: number[];
  exercises: ExerciseType[];
}

export default function ModalProgress({
  courseId,
  workoutId,
  onClose,
  initialProgress,
  exercises,
}: ModalWorkOutProps) {
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
      await saveTrainProgress(
        courseId,
        workoutId,
        {
          progressData: tempProgress,
        },
        token,
      );

      dispatch(setCurrentProgress(tempProgress));

      alert('Успех');
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      setErrorMessage(
        'Не удалось сохранить прогресс. Проверьте формат данных.',
      );
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