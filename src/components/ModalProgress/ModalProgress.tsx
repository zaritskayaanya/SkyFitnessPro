'use client';

import styles from './modalProgress.module.css';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getProgressTrain,
  saveTrainProgress,
} from '../../services/course/courseApi';
import BaseButton from '../Button/Button';
import { ProgressWorkOutTypes } from '../../sharedTypes/shared.Types';
import { setCurrentProgress } from '../../store/features/courseSlice';
import ModalSuccess from '../ModalSuccess/ModalSucces';
export interface ModalWorkOutProps {
  courseId: string;
  workoutId: string;
  onClose: () => void;
  initialProgress: number[];
}
export default function ModalProgress({
  courseId,
  workoutId,
  onClose,
  initialProgress,
}: ModalWorkOutProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { workouts } = useAppSelector((state) => state.course);
  const [tempProgress, setTempProgress] = useState<number[]>(initialProgress);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId || !token) {
      return;
    }

    getProgressTrain(courseId, workoutId, token)
      .then((res: ProgressWorkOutTypes) => {
        const progress = res.progressData;
        dispatch(setCurrentProgress(progress));
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            console.log(error.response.data);
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
            setErrorMessage('Что-то с интернетом');
          } else {
            setErrorMessage('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, workoutId, token, dispatch]);

  useEffect(() => {
    setTempProgress(initialProgress);
  }, [initialProgress]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = parseInt(value, 10) || 0;

    const newProgress = [...tempProgress];
    newProgress[index] = numericValue;
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
      <ModalSuccess onClose={() => setIsModalOpen(false)} />;
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
              {tempProgress.map((progressValue, index) => (
                <div key={index}>
                  <label className={styles.modal__label}>
                    Сколько раз вы сделали упражнение{}?
                  </label>
                  <input
                    className={styles.modal__input}
                    type="text"
                    min="0"
                    placeholder="0"
                    value={progressValue}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </div>
              ))}
            </form>
            <BaseButton
              disabled={isLoading}
              onClick={handleSave}
              fullWidth={true}
              text={isLoading ? 'Сохранение...' : 'Сохранить прогресс'}
            />
          </div >
        </div>
      </div>
    </div>
  );
}