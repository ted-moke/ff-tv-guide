import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  text: string;
  to?: string;
  isActive: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ text, to, isActive, onClick }) => {

  return (
    <Link to={to ? to : "#"} className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
      {text}
    </Link>
  );
};

export default MenuItem;