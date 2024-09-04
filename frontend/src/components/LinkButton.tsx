import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LinkButton.module.css';

export enum LinkButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface LinkButtonProps {
  to: string;
  color?: LinkButtonColor;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Add onClick prop
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, color = LinkButtonColor.PRIMARY, children, onClick }) => {
  const className = color === LinkButtonColor.PRIMARY ? styles.primaryLinkButton : styles.secondaryLinkButton;

  return (
    <Link to={to} className={styles.link}>
      <button className={className} onClick={onClick}>
        {children}
      </button>
    </Link>
  );
};

export default LinkButton;