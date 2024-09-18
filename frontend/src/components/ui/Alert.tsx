import React from 'react';
import styles from './Alert.module.css';
import Button from './Button';

interface AlertProps {
  message?: string;
  buttonText: string;
  onButtonClick: () => void;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ message, buttonText, onButtonClick, children }) => {
  return (
    <div className={styles.alert}>
      { message && <p>{message}</p> }
      { children }
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
};

export default Alert;