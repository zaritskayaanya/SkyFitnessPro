'use client';

import styles from './me.module.css';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../store/store';
import { logout } from '../../../../store/features/authSlice';
import { clearAuthState } from '../../../../store/features/authSrorage';
import Image from 'next/image';
import CoursesBlock from '../../../../components/CoursesBlock/CoursesBlock';
import { useRouter } from 'next/navigation';
import { getCourses, getCoursesMe } from '../../../../servises/course/courseApi';
import { useEffect, useRef } from 'react';
import { setAllCourses, setFetchError, setFetchIsLoading, setMyCourseIds, setMyCourses } from '../../../../store/features/courseSlise';
import { saveMyCourseIds } from '../../../../store/features/courseStorage';

export default function MeCourses() {
  const user = useAppSelector((state) => state.auth.user);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { allCourses, myCourseIds, fetchError, fetchIsLoading, myCourses } =
    useAppSelector((state) => state.course);
  const hasFetchedUserCourses = useRef(false);

  const onLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    clearAuthState();
    dispatch(logout());
    router.push('/');
  };

  useEffect(() => {
    if (!token || hasFetchedUserCourses.current) {
      return;
    }
    hasFetchedUserCourses.current = true;
    dispatch(setFetchIsLoading(true));
    getCoursesMe(token)
      .then((res) => {
        const userObject = res.user;
        const serverIds = userObject.selectedCourses ?? [];
        const merged = Array.from(new Set([...myCourseIds, ...serverIds]));
        dispatch(setMyCourseIds(merged));
        saveMyCourseIds(merged);
      })
      .catch((err) => {
        dispatch(
          setFetchError(err instanceof Error ? err.message : 'Неизвестная ошибка'),
        );
        hasFetchedUserCourses.current = false;
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- один раз при монтировании
  }, [dispatch, token]);

  // Загружаем полный список курсов на профиле, если ещё не загружен (нужно для отображения всех «Мои курсы»)
  useEffect(() => {
    if (allCourses.length > 0) return;
    getCourses()
      .then((list) => dispatch(setAllCourses(list)))
      .catch(() => {});
  }, [allCourses.length, dispatch]);

  useEffect(() => {
    if (myCourseIds.length === 0 || allCourses.length === 0) {
      return;
    }
    const filteredCourses = myCourseIds
      .map((id) => allCourses.find((c) => c._id === id))
      .filter((c): c is NonNullable<typeof c> => c != null);
    dispatch(setMyCourses(filteredCourses));
  }, [myCourseIds, allCourses, dispatch]);

  if (fetchIsLoading) {
    return (
      <div style={{ color: 'white', padding: '20px' }}>Загрузка данных ...</div>
    );
  }

  return (
    <>
      <div className={styles.center__container}>
        <h1 className={styles.course__descTitle}>Профиль</h1>
        <div className={styles.userContainer}>
          <div className={styles.userImg}>
            <Image
              src="/img/big_profil.png"
              alt="profile"
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>
            <div className={styles.header__user}>
              <div className={styles.userNameContainer}>
                <p className={styles.userNameMain}>{user}</p>
                <p className={styles.userName}>Логин: {user}</p>
              </div>
            </div>
            <button className={styles.modal__btnLogOut} onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>
        <h1 className={styles.course__descTitle}>Мои курсы</h1>
        <div className={styles.center__courses}></div>
        <CoursesBlock
          courses={myCourses}
          errorRes={fetchError}
          isLoading={fetchIsLoading}
        />
      </div>
    </>
  );
}