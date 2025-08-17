import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: 'default' | 'primary' | 'muted' | 'success' | 'danger' |'info' | 'warning' | 'clear';
  size?: 'small' | 'large';
}

const Chip: React.FC<ChipProps> = ({ label, onClick, variant = 'default', size = 'small' }) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className={`${styles.chip} ${styles[variant]} ${styles[size]}`}
      onClick={handleClick}
      aria-label={label}
      role="button"
    >
      <p>{label}</p>
    </div>
  );
};

export default Chip;