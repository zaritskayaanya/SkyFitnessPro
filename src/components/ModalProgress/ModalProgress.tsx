'use client';

import styles from './modalProgress.module.css';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getWorkOutList,
  saveTrainProgress,
} from '../../services/course/courseApi';
import BaseButton from '../Button/Button';
import { WorkOutTypes } from '../../sharedTypes/shared.Types';
import { useRouter } from 'next/navigation';

export interface ModalWorkOutProps {
  courseId: string;
  workoutId: string;
  onClose: () => void;
  initialProgress: number[]; 
  onSaveProgress: (updatedProgress: number[]) => void;
}
export default function ModalProgress({
  courseId,
  workoutId,
  onClose,
  initialProgress,
}: ModalWorkOutProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const [currentProgress, setCurrentProgress] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
   const {workouts} = useAppSelector((state) => state.course);
  const [tempProgress, setTempProgress] = useState<number[]>(initialProgress);
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
      // API ожидает { "progressData": [10, 0, 5] }
      await saveTrainProgress(token, courseId, workoutId, {
        progressData: tempProgress,
      });

      // Успех
      // onSaveProgress(tempProgress);

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
          <form className={styles.modal__form}>
            <button className={styles.modal__close} onClick={onClose}>
              X
            </button>
            <h3>Мой прогресс {workoutId}</h3>

            {tempProgress.map((progressValue, index) => (
              <div key={index} >
                <label >
                  Сколько раз вы сделали {index + 1}?:
                </label>
                <input
                  type="number"
                  min="0"
                  value={progressValue}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                
                />
              </div>
            ))}

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            <BaseButton
              disabled={isLoading}
              onClick={handleSave}
              fullWidth={true}
              text={isLoading ? 'Сохранение...' : 'Сохранить прогресс'}
            />

          </form>
        </div>
      </div>
    </div>
  );
}