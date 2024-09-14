import React from 'react';
import styles from './Alert.module.css';
import Button from './Button';

interface AlertProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className={styles.alert}>
      <p>{message}</p>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
};

export default Alert;