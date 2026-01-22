'use client';

import { AxiosError } from 'axios';
import styles from './workout.module.css';
import { useAppDispatch, useAppSelector } from '../../../../../../store/store';
import { useParams } from 'next/navigation';
import {
  setCompletedWorkout,
  setCurrentProgress,
  setWorkoutData,
} from '../../../../../../store/features/courseSlice';
import {
  getProgressTrain,
  getWorkOutId,
} from '../../../../../../services/course/courseApi';
import Header from '../../../../../../components/Header/Header';
import BaseButton from '../../../../../../components/Button/Button';
import ModalProgress from '../../../../../../components/ModalProgress/ModalProgress';
import {
  ProgressWorkOutTypes,
  WorkOutTypes,
} from '../../../../../../sharedTypes/shared.Types';
import { useEffect, useState } from 'react';

export default function WorkoutPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ courseId: string; workoutId: string }>();
  const { allCourses, workoutData, currentProgress } = useAppSelector(
    (state) => state.course,
  );
  const workoutID = params.workoutId;
  const courseId = params.courseId;
  const token = useAppSelector((state) => state.auth.token);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetCourse = allCourses.find((course) => course._id === courseId);
  const courseName = targetCourse
    ? targetCourse.nameRU
    : 'Название курса не найдено';

  useEffect(() => {
    if (!workoutID || !courseId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const loadData = async () => {
      try {
        const workoutDetails: WorkOutTypes = await getWorkOutId(
          workoutID,
          token,
        );
        dispatch(setWorkoutData(workoutDetails));

        const initialProgress = new Array(workoutDetails.exercises.length).fill(
          0,
        );
        dispatch(setCurrentProgress(initialProgress));

        const progressList: ProgressWorkOutTypes = await getProgressTrain(
          courseId,
          workoutID,
          token,
        );
        const currentProgress = progressList.progressData;

        if (currentProgress?.length) {
          dispatch(setCurrentProgress(currentProgress));
        }
        if (progressList.workoutCompleted === true) {
          dispatch(setCompletedWorkout(progressList.workoutId));
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setErrorMessage(
            error.response.data.message || 'Ошибка загрузки данных тренировки.',
          );
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        }
        dispatch(setWorkoutData(null));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [workoutID, courseId, token, dispatch]);

  function calcPercent(done: number, total: number) {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }

  if (isLoading) {
    return (
      <div style={{ color: 'white', padding: '20px' }}>
        Загрузка данных тренировки и прогресса...
      </div>
    );
  }

  if (errorMessage || !workoutData) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        Ошибка: {errorMessage || 'Данные тренировки не найдены.'}
      </div>
    );
  }

  const videoUrl = workoutData?.video;

  return (
    <div className={styles.workoutContainer}>
      <Header />
      <h1 className={styles.workoutTitle}>{courseName}</h1>
      {videoUrl ? (
        <iframe
          className={styles.videoBlock}
          width="100%"
          height="639px"
          src={videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <p style={{ color: 'black' }}>Ссылка на видео отсутствует.</p>
      )}
      <div className={styles.exercisesBlock}>
        <h2 className={styles.exercisesBlockTitle}>Упражнения тренировки</h2>
        <ul className={styles.exercisesBlockUl}>
          {workoutData.exercises.map((exercise, index) => {
            const percent = calcPercent(
              currentProgress[index],
              exercise.quantity,
            );
            return (
              <li className={styles.exercisesBlockList} key={exercise._id}>
                {exercise.name} (
                {(currentProgress[index] / exercise.quantity) * 100 || 0} %)
                <div
                  className={styles.course__done}
                  style={{ width: `${percent}%` }}
                ></div>
              </li>
            );
          })}
        </ul>

        <BaseButton
          disabled={isLoading}
          onClick={() => setIsModalOpen(true)}
          fullWidth={false}
          text={
            currentProgress.length
              ? 'Обновить свой прогресс'
              : 'Заполнить свой прогресс'
          }
        />
        {isModalOpen && (
          <ModalProgress
            key={workoutID}
            courseId={courseId}
            workoutId={workoutID}
            initialProgress={currentProgress}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}