import React from 'react';
import styles from './SplashPage.module.css';
import logo from "/vite.svg";
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";

const SplashPage: React.FC = () => {
  return (
    <div className="container">
      <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
      <h1>FF TV Guide</h1>
      <p>Your ultimate free guide to fantasy football, helping you stay ahead of the game.</p>
      <div className={styles.buttonContainer}>
        <Button link="/auth?register=true">Create Account</Button>
        <LinkButton to="/auth">Sign In</LinkButton>
      </div>
    </div>
  );
};

export default SplashPage;