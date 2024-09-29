import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  color?: 'default'  | 'secondary' | 'clear';
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, className, color = 'default' }) => {
  return (
    <button className={`${styles.iconButton} ${styles[color]} ${className}`} onClick={onClick}>
      {icon}
    </button>
  );
};

export default IconButton;