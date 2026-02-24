'use client';

import { useModal } from '../../context/ModalContext';
import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUser } from '../../servises/auth/authApi';
import { setToken, setUser } from '../../store/features/authSlice';
import { saveAuthState } from '../../store/features/authSrorage';
import BaseButton from '../Button/Button';
import { useAppDispatch } from '../../store/store';

export default function ModalLogin() {
  const { isLoginOpen, closeLogin, openRegister } = useModal();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginOpen) return null;

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    setIsLoading(true);
    setErrorMessage('');

    authUser({ email: trimmedEmail, password: trimmedPassword })
      .then((res) => {
        const token = res?.token;
        if (!token) {
          setErrorMessage('Сервер не вернул токен');
          return;
        }
        dispatch(setUser(trimmedEmail));
        dispatch(setToken(token));
        saveAuthState(trimmedEmail, token);
        closeLogin();
        router.push('/');
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onRegister = () => {
    closeLogin();
    openRegister();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <button onClick={closeLogin} className={styles.modal__close}>
              x
            </button>
            <Link href="/">
              <div className={styles.modal__logo}>
                <Image src="/logo.svg" alt="logo" width={220} height={35} />
              </div>
            </Link>
            <div className={styles.inputContainer}>
              <input
                className={classNames(styles.modal__input, styles.login)}
                type="text"
                name="login"
                placeholder="Логин"
                value={email}
                onChange={onChangeEmail}
              />
              <input
                className={classNames(styles.modal__input, styles.login)}
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={onChangePassword}
              />
              <div className={styles.errorContainer}>{errorMessage}</div>
            </div>
            <BaseButton
              disabled={isLoading}
              onClick={onSubmit}
              fullWidth={true}
              text="Войти"
            />
            <button onClick={onRegister} className={styles.modal__btnSignup}>
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}