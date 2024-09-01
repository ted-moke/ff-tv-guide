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
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, color = LinkButtonColor.PRIMARY, children }) => {
  const className = color === LinkButtonColor.PRIMARY ? styles.primaryLinkButton : styles.secondaryLinkButton;

  return (
    <Link to={to} className={styles.link}>
      <button className={className}>
        {children}
      </button>
    </Link>
  );
};

export default LinkButton;