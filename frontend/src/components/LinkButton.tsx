import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LinkButton.module.css';

export enum LinkButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface LinkButtonProps {
  to?: string;
  color?: LinkButtonColor;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, color = LinkButtonColor.PRIMARY, children, onClick }) => {
  const className = color === LinkButtonColor.PRIMARY ? styles.primaryLinkButton : styles.secondaryLinkButton;

  const buttonElement = (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );

  return to ? (
    <Link to={to} className={styles.link}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );
};

export default LinkButton;