import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, className }) => {
  return (
    <button className={`${styles.iconButton} ${className}`} onClick={onClick}>
      {icon}
    </button>
  );
};

export default IconButton;