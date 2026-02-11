'use client';

import styles from './modalUser.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/features/authSlice';
import { clearAuthState } from '../../store/features/authSrorage';
import { useAppSelector } from '../../store/store';
import BaseButton from '../Button/Button';

type ModalUserProps = {
  onClose?: () => void;
};

export default function ModalUser({ onClose }: ModalUserProps) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const onMyProfil = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    onClose?.();
    router.push('/users/me/courses');
  };

  const onLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClose?.();
    clearAuthState();
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      <div className={styles.userContainer}>
        <div className={styles.userNameContainer}>
          <p className={styles.userNameMain}>{user}</p>
          <p className={styles.userName}>{user}</p>
        </div>
        <BaseButton
          disabled={isLoading}
          onClick={onMyProfil}
          fullWidth={true}
          text="Мой профиль"
        />
        <button className={styles.modal__btnLogOut} onClick={onLogout}>
          Выйти
        </button>
      </div>
    </>
  );
}