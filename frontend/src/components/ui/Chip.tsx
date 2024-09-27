import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: 'default' | 'primary' | 'muted' | 'success' | 'danger' |'info' | 'warning' | 'clear';
}

const Chip: React.FC<ChipProps> = ({ label, onClick, variant = 'default' }) => {
  return (
    <div 
      className={`${styles.chip} ${styles[variant]}`}
      onClick={onClick}
      aria-label={label}
      role="button"
    >
      <p>{label}</p>
    </div>
  );
};

export default Chip;