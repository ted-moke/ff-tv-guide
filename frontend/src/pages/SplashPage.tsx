import React from 'react';
import styles from './SplashPage.module.css';
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";
import FFTVGLogo from '../assets/FFTVGLogo';

const SplashPage: React.FC = () => {
  return (
    <div className="container">
      <FFTVGLogo size="large" withText />
      <p>Your ultimate free guide to fantasy football, helping you stay ahead of the game.</p>
      <div className={styles.buttonContainer}>
        <Button link="/auth?register=true">Create Account</Button>
        <LinkButton to="/auth">Sign In</LinkButton>
      </div>
    </div>
  );
};

export default SplashPage;