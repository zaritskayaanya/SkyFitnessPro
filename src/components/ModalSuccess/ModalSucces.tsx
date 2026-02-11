'use client';

import Image from 'next/image';
import styles from './modalSuccess.module.css';

export interface ModalSuccessProps {
  onClose: () => void;
}

export default function ModalSuccess({ onClose }: ModalSuccessProps) {
  return (
    <div className={styles.wrapper} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className={styles.containerEnter} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__block}>
          <button type="button" className={styles.modal__close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
          <h4 id="success-title" className={styles.modal__titleCheck}>
            Ваш прогресс засчитан!
          </h4>
          <div className={styles.modal__icon}>
            <Image src="/icon/Check-in-Circle.svg" alt="" width={80} height={80} />
          </div>
        </div>
      </div>
    </div>
  );
}