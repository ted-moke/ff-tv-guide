import React from 'react';
import styles from './SplashPage.module.css';
import logo from '/vite.svg'; // Ensure the path to the logo is correct
import Button from './Button';
import LinkButton from './LinkButton';

const SplashPage: React.FC = () => {
  return (
    <div className="container">
      <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
      <h1>FF TV Guide</h1>
      <p>Your ultimate free guide to fantasy football, helping you stay ahead of the game.</p>
      <div className={styles.buttonContainer}>
        <Button link="/register">Create Account</Button>
        <LinkButton to="/login">Sign In</LinkButton>
      </div>
    </div>
  );
};

export default SplashPage;