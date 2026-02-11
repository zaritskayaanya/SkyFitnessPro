'use client';

import styles from './signup.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { useModal } from '../../context/ModalContext';
import { authUser, regUser } from '../../servises/auth/authApi';
import { setToken, setUser } from '../../store/features/authSlice';
import { saveAuthState } from '../../store/features/authSrorage';
import BaseButton from '../Button/Button';
import { useRouter } from 'next/navigation';

export default function ModalRegister() {
  const dispatch = useAppDispatch();
  const { isRegisterOpen, closeRegister, openLogin } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, seteIsLoading] = useState(false);
  const router = useRouter();

  if (!isRegisterOpen) return null;

  const correctPasswords = () => {
    return password === repeatPassword;
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    if (!correctPasswords()) {
      return setErrorMessage('Пароли не совпадают');
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    seteIsLoading(true);
    setErrorMessage('');

    regUser({ email: trimmedEmail, password: trimmedPassword })
      .then(() => authUser({ email: trimmedEmail, password: trimmedPassword }))
      .then((res) => {
        const token = res?.token;
        if (!token) {
          setErrorMessage('Не удалось войти после регистрации');
          return;
        }
        dispatch(setUser(trimmedEmail));
        dispatch(setToken(token));
        saveAuthState(trimmedEmail, token);
        closeRegister();
        router.push('/');
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        );
      })
      .finally(() => {
        seteIsLoading(false);
      });
  };

  const onLogin = () => {
    closeRegister();
    openLogin();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <button onClick={closeRegister} className={styles.modal__close}>
              x
            </button>
            <Link href="/">
              <div className={styles.modal__logo}>
                <Image width={220} height={35} src="/logo.svg" alt="logo" />
              </div>
            </Link>
            <div className={styles.inputContainer}>
              <input
                className={classNames(styles.modal__input, styles.login)}
                type="text"
                name="login"
                placeholder="Эл. почта"
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
              <input
                className={classNames(styles.modal__input, styles.login)}
                type="password"
                name="password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={onChangeRepeatPassword}
              />
              <div className={styles.errorContainer}>{errorMessage}</div>
            </div>
            <BaseButton
              disabled={isLoading}
              onClick={onSubmit}
              fullWidth={true}
              text="Зарегистрироваться"
            />
            <button onClick={onLogin} className={styles.modal__btnSignin}>
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}