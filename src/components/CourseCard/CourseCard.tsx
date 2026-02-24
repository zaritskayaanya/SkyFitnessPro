'use client';

import Image from 'next/image';
import styles from '../CenterBlock/centerBlock.module.css';
import cardStyles from './courseCard.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useCallback, useEffect, useState } from 'react';
import { CourseTypes, ProgressWorkOutCourseTypes } from '../../sharedTyres/shared.Types';
import BaseButton from '../Button/Button';
import { useCourse } from '../../hooks/useCourse';
import { useModal } from '../../context/ModalContext';
import ModalWorkOut from '../ModalWorkOut/ModalWorkOut';
import {
  resetCourseAdditionStatus,
  setCurrentCourse,
  setCurrentProgressCourse,
  setCompletedWorkoutsForCourse,
} from '../../store/features/courseSlise';
import {
  deleteAllCourseProgress,
  getProgressCourse,
} from '../../servises/course/courseApi';
import { useCourseProgress } from '../../hooks/useCourseProgres';

interface CourseTypeProp {
  course: CourseTypes;
  courseList?: CourseTypes[];
}

export default function CourseCard({ course }: CourseTypeProp) {
  const courseId = course._id;
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useModal();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const { toggleAddRemove } = useCourse(course);
  const dispatch = useAppDispatch();
  const isCourseInMyCourses = useAppSelector((state) =>
    state.course.myCourses.some((c) => c._id === course._id),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !token) {
      return;
    }

    getProgressCourse(courseId, token)
      .then((res: ProgressWorkOutCourseTypes) => {
        dispatch(
          setCurrentProgressCourse({
            courseId,
            progress: res,
          }),
        );
        const completedIds =
          res?.workoutsProgress
            ?.filter((w) => w.workoutCompleted)
            .map((w) => w.workoutId) ?? [];
        dispatch(setCompletedWorkoutsForCourse({ courseId, workoutIds: completedIds }));
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, token, dispatch]);

  const totalWorkouts = course.workouts?.length ?? 0;
  const finalPercentage = useCourseProgress(courseId, totalWorkouts);

  const onCourse = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/allCourses/courses/${courseId}`);
  };

  const handleStartOrContinue = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentCourse(course);
      setIsModalOpen(true);
    },
    [course],
  );

  const handleReset = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);
      deleteAllCourseProgress(courseId, token).finally(() => {
        setIsLoading(false);
        dispatch(resetCourseAdditionStatus(courseId));
      });
    },
    [courseId, token, dispatch],
  );

  let buttonAction;
  let buttonText;

  if (finalPercentage === 100) {
    buttonText = 'Начать заново';
    buttonAction = handleReset;
  } else if (finalPercentage > 0) {
    buttonText = 'Продолжить';
    buttonAction = handleStartOrContinue;
  } else {
    buttonText = 'Начать тренировку';
    buttonAction = handleStartOrContinue;
  }

  const imageName = course.nameEN.toLowerCase().replace(' ', '');
  const imagePath = `/img/${imageName}.png`;
  const OnMyProfileCoursesPage = pathname === '/users/me/courses';

  return (
    <div
      className={`${styles.center__courses} ${cardStyles.card}`}
      onClick={onCourse}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/allCourses/courses/${courseId}`);
        }
      }}
      aria-label={`Перейти к курсу ${course.nameRU}`}
    >
      <div className={styles.center__course}>
        <div className={styles.center__courseIMG}>
          <Image
            src={imagePath}
            alt={course.nameEN}
            loading="eager"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
          />
        </div>

        {user ? (
          !isCourseInMyCourses ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleAddRemove(e);
              }}
              className={`${styles.course__Image} ${cardStyles.cardAddButton}`}
              title="Добавить курс"
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.course__add__svg}>
                <Image
                  src="/icon/Add-in-Circle.svg"
                  alt="add"
                  loading="eager"
                  height={32}
                  width={32}
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleAddRemove(e);
              }}
              className={`${styles.course__Image} ${cardStyles.cardAddButton}`}
              title="Удалить курс"
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.course__add__svg}>
                <Image
                  src="/icon/Remove.svg"
                  alt="remove"
                  loading="eager"
                  height={32}
                  width={32}
                />
              </div>
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLogin();
            }}
            className={`${styles.course__Image} ${cardStyles.cardAddButton}`}
            title="Войти для добавления курса"
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.course__add__svg}>
              <Image
                src="/icon/Add-in-Circle.svg"
                alt="add"
                loading="eager"
                height={32}
                width={32}
              />
            </div>
          </button>
        )}
        <div className={styles.course__block}>
          <h3 className={styles.course__title}>{course.nameRU}</h3>
          <div className={styles.course__course}>
            <div className={styles.course__blockAbout}>
              <div className={styles.course__about}>
                <div className={styles.course__Image}>
                  <Image
                    src="/icon/Calendar.svg"
                    alt="Calendar"
                    loading="eager"
                    height={18}
                    width={18}
                  />
                </div>
                <p>{course.durationInDays} дней</p>
              </div>
              <div className={styles.course__about}>
                <div className={styles.course__Image}>
                  <Image
                    src="/icon/Time.svg"
                    alt="time"
                    loading="eager"
                    height={18}
                    width={18}
                  />
                </div>
                <p>
                  {course.dailyDurationInMinutes.from} -{' '}
                  {course.dailyDurationInMinutes.to}мин/день
                </p>
              </div>
            </div>
            <div className={styles.course__about}>
              <div className={styles.course__Image}>
                <Image
                  src="/icon/mingcute_signal-fill.svg"
                  alt="mingcute"
                  loading="eager"
                  height={18}
                  width={18}
                />
              </div>
              <p>Сложность</p>
            </div>
          </div>
          {isCourseInMyCourses && OnMyProfileCoursesPage && (
            <div>
              <div>
                <p className={styles.course__progressText}>
                  Прогресс: {finalPercentage}%
                </p>
                <div
                  className={styles.course__progress}
                  style={{ width: `${finalPercentage}%` }}
                ></div>
              </div>
              <BaseButton
                disabled={isLoading}
                onClick={buttonAction}
                fullWidth={true}
                text={buttonText}
              />
            </div>
          )}
          {isModalOpen ? (
            <ModalWorkOut
              key={courseId}
              courseId={courseId}
              onClose={() => setIsModalOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}