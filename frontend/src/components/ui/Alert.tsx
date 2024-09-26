import React from "react";
import styles from "./Alert.module.css";
import Button from "./Button";

interface AlertProps {
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  variant?: "default" | "info";
}

const Alert: React.FC<AlertProps> = ({
  message,
  buttonText = "Close",
  onButtonClick,
  children,
  variant = "default",
}) => {
  return (
    <div className={`${styles.alert} ${styles[variant]}`}>
      {message && <p>{message}</p>}
      {children}
      {onButtonClick && <Button onClick={onButtonClick}>{buttonText}</Button>}
    </div>
  );
};

export default Alert;
