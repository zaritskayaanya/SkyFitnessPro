'use client';

import styles from './modalWorkOut.module.css';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getWorkOutList } from '../../services/course/courseApi';
import BaseButton from '../Button/Button';
import { WorkOutTypes } from '../../sharedTypes/shared.Types';
import { useRouter } from 'next/navigation';
import { setWorkouts } from '../../store/features/courseSlice';

export interface ModalWorkOutProps {
  courseId: string;
  onClose: () => void;
}
export default function ModalWorkOut({ courseId, onClose }: ModalWorkOutProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const {workouts} = useAppSelector((state) => state.course);
const completedWorkoutIds = ['workout_id_1', 'workout_id_2'];

  useEffect(() => {
    if (!courseId || !token) {
      return;
    }

    getWorkOutList(courseId, token)
      .then((res: WorkOutTypes[]) => {
        console.log(res);
        dispatch(setWorkouts(res));
        if (res.length > 0) {
          setSelectedWorkoutId(res[0]._id);
        }
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
  }, [courseId, token, dispatch]);



  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (!selectedWorkoutId) {
      setErrorMessage('Сначала выберите тренировку.');
      return;
    }
    setIsLoading(false);
    router.push(
      `/allCourses/courses/${courseId}/workouts/${selectedWorkoutId}`,
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <button className={styles.modal__close} onClick={onClose}>X</button>
            <h3 className={styles.modal__title}>Выберите тренировку</h3>
            {/* <div className={styles.inputContainer}>
              {isLoading ? (
                <span style={{ color: 'white' }}>Загрузка тренировок...</span>
              ) : workouts.length === 0 ? (
                <p>Тренировок нет.</p>
              ) : (
                workouts.map((workout) => (
                    
                  <div key={workout._id} >
                    <input
                      type="radio"
                      id={`workout-${workout._id}`}
                      name="selectedWorkout"
                      value={workout._id}
                      checked={selectedWorkoutId === workout._id}
                      onChange={() => setSelectedWorkoutId(workout._id)}
                    />
                    <label htmlFor={`workout-${workout._id}`}>
                      {workout.name}
                    </label>
                    <p>Упражнений: {workout.exercises.length}</p>
                  </div>
                ))
              )}
              <div className={styles.errorContainer}>{errorMessage}</div>
            </div> */}
            <div className={styles.inputContainer}>
              {isLoading ? (
                <span style={{ color: 'white' }}>Загрузка тренировок...</span>
              ) : workouts.length === 0 ? (
                <p>Тренировок нет.</p>
              ) : (
                workouts.map((workout) => {
                    
                    const isSelected = selectedWorkoutId === workout._id;
                    const isCompleted = completedWorkoutIds.includes(workout._id);
                    
         
                    const itemClassName = [
                        styles.workoutItem,
                        isSelected ? styles.selectedItem : '',
                        isCompleted ? styles.completed : ''
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
                            
                         
                            <div className={styles.customIndicator}>
                               
                            </div>
                            
                     
                            <div className={styles.workoutLabel}>
                                <span className={styles.workoutName}>{workout.name}</span>
                                <span className={styles.workoutSubtitle}>
                                    / День {workout._id.substring(0, 1)} 
                                    {/* Замените на реальное получение номера дня, если нужно */}
                                </span>
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