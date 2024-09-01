import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface ButtonProps {
  link?: string;
  onClick?: () => void;
  color?: ButtonColor;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ link, onClick, color = ButtonColor.PRIMARY, children }) => {
  const className = color === ButtonColor.PRIMARY ? styles.primaryButton : styles.secondaryButton;

  if (link) {
    return (
      <Link to={link}>
        <button className={className} onClick={onClick}>
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
