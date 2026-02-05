'use client';

import Image from 'next/image';
import styles from '../CenterBlock/centerBlock.module.css';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import { useState } from 'react';
import { CourseTypes } from '../../sharedTypes/shared.Types';
import BaseButton from '../Button/Button';
import { useCourse } from '../../hooks/useCourse';
import { useModal } from '../../context/ModalContext';
import ModalWorkOut from '../ModalWorkOut/ModalWorkOut';
import { setCurrentCourse } from '../../store/features/courseSlice';

interface CourseTypeProp {
  course: CourseTypes;
  courseList?: CourseTypes[];
}

export default function CourseCard({ course }: CourseTypeProp) {
  const courseId = course._id;
  const router = useRouter();
  const { openLogin } = useModal();
  const user = useAppSelector((state) => state.auth.user);
  const { toggleAddRemove } = useCourse(course);
  const [isLoading, seteIsLoading] = useState(false);
  const isCourseInMyCourses = useAppSelector((state) =>
    state.course.myCourses.some((c) => c._id === course._id),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentProgress } = useAppSelector((state) => state.course);

  const onCourse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    seteIsLoading(true);
    router.push(`/allCourses/courses/${courseId}`);
  };

  const onWorkOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    seteIsLoading(true);
    openWorkOut();
  };
  const openWorkOut = () => {
    setCurrentCourse(course);
    setIsModalOpen(!isModalOpen);
  };
  const imageName = course.nameEN.toLowerCase().replace(' ', '');
  const imagePath = `/img/${imageName}.png`;

  return (
    <div className={styles.center__courses}>
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
          <button onClick={toggleAddRemove} className={styles.course__Image}>
            <svg className={styles.course__add__svg}>
              <use
                xlinkHref={`/icon/${isCourseInMyCourses ? 'Remove.svg' : 'Add-in-Circle.svg'}`}
              ></use>
            </svg>
          </button>
        ) : (
          <button onClick={openLogin} className={styles.course__Image}>
            <svg className={styles.course__add__svg}>
              <use xlinkHref="/icon/Add-in-Circle.svg"></use>
            </svg>
          </button>
        )}
        <div className={styles.course__block}>
          <h3 className={styles.course__title}>{course.nameRU}</h3>
          <div className={styles.course__course} onClick={onCourse}>
            <div className={styles.course__blockAbout}>
              <div className={styles.course__about}>
                <div className={styles.course__Image}>
                  <svg className={styles.course__svg}>
                    <use xlinkHref="/icon/Calendar.svg"></use>
                  </svg>
                </div>
                <p>{course.durationInDays} дней</p>
              </div>
              <div className={styles.course__about}>
                <div className={styles.course__Image}>
                  <svg className={styles.course__svg}>
                    <use xlinkHref="/icon/Time.svg"></use>
                  </svg>
                </div>
                <p>
                  {course.dailyDurationInMinutes.from} -{' '}
                  {course.dailyDurationInMinutes.to}мин/день
                </p>
              </div>
            </div>
            <div className={styles.course__about}>
              <div className={styles.course__Image}>
                <svg className={styles.course__svg}>
                  <use xlinkHref="/icon/mingcute_signal-fill.svg"></use>
                </svg>
              </div>
              <p>Сложность</p>
            </div>
          </div>
          {isCourseInMyCourses && (
            <div>
              <div>
                <p className={styles.course__progressText}>
                  Прогресс{currentProgress}%
                </p>
                <div className={styles.course__progress}></div>
              </div>
              <BaseButton
                disabled={isLoading}
                onClick={onWorkOut}
                fullWidth={true}
                text={
                  currentProgress.length ? 'Продолжить' : 'Начать тренировку'
                }
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