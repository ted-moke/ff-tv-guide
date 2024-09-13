import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  CLEAR = 'clear',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  link?: string;
  color?: ButtonColor;
}

const Button: React.FC<ButtonProps> = ({ link, onClick, color = ButtonColor.PRIMARY, children, ...props }) => {
  const className = styles[color];

  if (link) {
    return (
      <Link to={link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className={className} onClick={onClick} {...props}>
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
