'use client';

import { useState, useSyncExternalStore } from 'react';
import styles from './header.module.css';
import Image from 'next/image';
import Link from 'next/link';
import BaseButton from '../Button/Button';
import { useAppSelector } from '../../store/store';
import ModalUser from '../ModalUser/ModalUser';
import { useModal } from '../../context/ModalContext';

function useIsMounted(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export default function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useIsMounted();
  const { openLogin } = useModal();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header__block}>
        <div>
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={220} height={35} />
          </Link>
          <p className={styles.header__text}>
            Онлайн-тренировки для занятий дома
          </p>
        </div>
        <>
          {!isMounted ? (
            <BaseButton
              disabled={false}
              onClick={() => {}}
              text="Войти"
              fullWidth={false}
            />
          ) : !user ? (
            <BaseButton
              disabled={false}
              onClick={openLogin}
              text="Войти"
              fullWidth={false}
            />
          ) : (
            <div className={styles.header__user} onClick={toggleModal}>
              <Image
                src="/img/Profile.png"
                alt="profile"
                width={50}
                height={50}
              />
              <p className={styles.header__userText}>{user}</p>
            </div>
          )}
        </>
        {user && (isModalOpen ? <ModalUser onClose={() => setIsModalOpen(false)} /> : null)}
      </div>
    </div>
  );
}