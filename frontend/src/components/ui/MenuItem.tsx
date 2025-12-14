import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  text: string;
  to?: string;
  isActive: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ text, to, isActive, icon, onClick }) => {

  return (
    <Link to={to ? to : "#"} className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <span>{text}</span>
    </Link>
  );
};

export default MenuItem;