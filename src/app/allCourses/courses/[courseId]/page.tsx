'use client';

import Image from 'next/image';
import styles from './course.module.css';
import BaseButton from '../../../../components/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CourseTypes } from '../../../../sharedTyres/shared.Types';
import { getCoursesId, getCoursesMe } from '../../../../servises/course/courseApi';
import { useModal } from '../../../../context/ModalContext';
import { useCourse } from '../../../../hooks/useCourse';
import { setMyCourseIds } from '../../../../store/features/courseSlise';
import { saveMyCourseIds } from '../../../../store/features/courseStorage';

export default function Course() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const myCourseIds = useAppSelector((state) => state.course.myCourseIds);
  const dispatch = useAppDispatch();
  const params = useParams<{ courseId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourses] = useState<CourseTypes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { openLogin } = useModal();
  const courseID =
    typeof params.courseId === 'string'
      ? params.courseId
      : Array.isArray(params.courseId)
        ? params.courseId[0]
        : '';
  const { toggleAddRemove, isAdd, isLoading: isCourseActionLoading } = useCourse(
    course,
    courseID || undefined,
  );

  // Подгружаем список «Мои курсы» с сервера, если в сторе пусто — чтобы при добавлении не затереть уже добавленные
  useEffect(() => {
    if (!token || myCourseIds.length > 0) return;
    getCoursesMe(token)
      .then((res) => {
        const ids = res.user?.selectedCourses ?? [];
        const serverIds = Array.isArray(ids) ? ids : [];
        const merged = Array.from(new Set([...myCourseIds, ...serverIds]));
        dispatch(setMyCourseIds(merged));
        saveMyCourseIds(merged);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при пустом myCourseIds
  }, [token, myCourseIds.length, dispatch]);

  useEffect(() => {
    if (!courseID) return;

    if (course && course._id === courseID) {
      return;
    }

    getCoursesId(courseID)
      .then((res: CourseTypes) => {
        setCourses(res);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseID, course, error]);

  if (!course) {
    return (
      <div>{error ? `Ошибка: ${error}` : 'Загрузка деталей курса...'}</div>
    );
  }

  const imageName = course.nameEN.toLowerCase().replace(' ', '');
  const imagePath = `/img/skill${imageName}.png`;
  const imagePathMob = `/img/${imageName}.png`;

  return (
    <div>
      <div className={styles.course__conteiner}>
        <div className={styles.course__ImagedescTop}>
          <Image
            src={imagePath}
            alt={course.nameEN}
            loading="eager"
            width={1160}
            height={310}
          />
        </div>
        <div className={styles.course__ImageMob}>
          <Image src={imagePathMob} alt="yoga" width={343} height={389} />
        </div>
        <h2 className={styles.course__descTitle}>Подойдет для вас, если:</h2>
        <div className={styles.course__desc}>
          {course.fitting.map((fittingText, index) => (
            <div key={index} className={styles.course__descBlock}>
              <p className={styles.course__descNumb}>{index + 1}</p>
              <p className={styles.course__descText}>{fittingText}</p>
            </div>
          ))}
        </div>
        <h2 className={styles.course__descTitle}>Направления</h2>
        <div className={styles.course__category}>
          {course.directions.map((directionsText, index) => (
            <div key={index} className={styles.course__categoryName}>
              <Image
                src="/icon/Icon_Star.svg"
                alt="star"
                loading="eager"
                height={26}
                width={26}
              />
              <p className={styles.course__categoryText}>{directionsText}</p>
            </div>
          ))}
        </div>
        <div className={styles.course__groupImage}>
          <div>
            <svg className={styles.course__svgMan}>
              <use xlinkHref="/man.svg"></use>
            </svg>
          </div>
          <div>
            <svg className={styles.course__svgBlack}>
              <use xlinkHref="/Vector1.svg"></use>
            </svg>
          </div>
          <div>
            <svg className={styles.course__svgGreen}>
              <use xlinkHref="/Vector2.svg"></use>
            </svg>
          </div>
        </div>
        <div className={styles.course__groupImageMob}>
          <svg className={styles.course__manMob}>
            <use xlinkHref="/img/GroupMan.svg"></use>
          </svg>
        </div>
        <div className={styles.course__way}>
          <div className={styles.course__wayBlock}>
            <h1 className={styles.course__wayTitle}>
              Начните путь к новому телу
            </h1>
            <ul className={styles.course__wayList}>
              <li className={styles.course__wayText}>
                проработка всех групп мышц
              </li>
              <li className={styles.course__wayText}>тренировка суставов</li>
              <li className={styles.course__wayText}>
                улучшение циркуляции крови
              </li>
              <li className={styles.course__wayText}>
                упражнения заряжают бодростью
              </li>
              <li className={styles.course__wayText}>
                помогают противостоять стрессам
              </li>
            </ul>
            {user &&
              (isAdd ? (
                <BaseButton
                  disabled={isLoading || isCourseActionLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleAddRemove(e);
                  }}
                  fullWidth={true}
                  text={'Удалить курс'}
                />
              ) : (
                <BaseButton
                  disabled={isLoading || isCourseActionLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleAddRemove(e);
                  }}
                  fullWidth={true}
                  text={'Добавить курс'}
                />
              ))}
            {!user && (
              <BaseButton
                disabled={isLoading}
                onClick={openLogin}
                fullWidth={true}
                text={'Войдите, чтобы добавить курс'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}