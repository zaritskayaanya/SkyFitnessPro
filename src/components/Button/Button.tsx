import styles from './button.module.css';

type BaseButton = {
  text: string;
  fullWidth: boolean;
  disabled?:boolean,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void

};

export default function BaseButton({ text, fullWidth = false, disabled, onClick }: BaseButton) {

  return (
    <button className={fullWidth ? styles.fullWidth : styles.button} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}