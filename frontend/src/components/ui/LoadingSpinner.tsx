import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ text }: { text?: string }) => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
};

export default LoadingSpinner;  