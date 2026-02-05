import Image from 'next/image';
import styles from '../ModalProgress/modalProgress.module.css';
export interface ModalWorkOutProps {
  onClose: () => void;
}
export default function ModalSuccess({
  onClose
}: ModalWorkOutProps) {
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
            <button className={styles.modal__close} onClick={onClose}>
              X
            </button>
            <h4 className={styles.modal__titleCheck}>Ваш прогресс засчитан!</h4>
             <Image src="/icon/Check-in-Circle.svg" alt="check" width={68} height={68} />
        </div>
      </div>
    </div>
  );
}