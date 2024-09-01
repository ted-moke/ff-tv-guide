import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ButtonLink.module.css';

export enum ButtonLinkColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface ButtonLinkProps {
  to: string;
  color?: ButtonLinkColor;
  children: React.ReactNode;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ to, color = ButtonLinkColor.PRIMARY, children }) => {
  const className = color === ButtonLinkColor.PRIMARY ? styles.primaryButton : styles.secondaryButton;

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default ButtonLink;