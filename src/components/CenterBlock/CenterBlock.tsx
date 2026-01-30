'use client';

import Image from 'next/image';
import styles from './centerBlock.module.css';
import BaseButton from '../Button/Button';
import CoursesBlock from '../CoursesBlock/CoursesBlock';
import { useAppSelector } from '../../store/store';

// interface CenterBLockProps {
//   courses: CourseTypes[];
//   errorRes: string | null;
//   isLoading: boolean;
// }

export default function CenterBlock() {
  const { fetchError, fetchIsLoading, allCourses } = useAppSelector(
    (state) => state.course,
  );
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.center__container}>
      <div className={styles.center__block}>
        <h1 className={styles.center__title}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <div className={styles.center__textBlock}>
          <p className={styles.center__text}>Измени своё тело за полгода!</p>
          <div className={styles.center__img}>
            <Image src="/Polygon1.png" alt="polygon" width={30} height={35} />
          </div>
        </div>
      </div>
      <CoursesBlock
        courses={allCourses}
        errorRes={fetchError}
        isLoading={fetchIsLoading}
      />
      <div className={styles.center__button}>
        <BaseButton
          disabled={fetchIsLoading}
          onClick={handleScrollToTop}
          text="Наверх ↑"
          fullWidth={false}
        />
      </div>
    </div>
  );
}