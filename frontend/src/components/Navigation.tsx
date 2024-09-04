import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/connect-team">Connect Team</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;