import React from "react";
import styles from "./SplashPage.module.css";
import Button from "../components/ui/Button";
import LinkButton from "../components/ui/LinkButton";
import FFTVGLogo from "../assets/FFTVGLogo";
import tvGuidePreview from "../assets/tv-guide-preview.png";

const SplashPage: React.FC = () => {
  return (
    <div className={styles.splashContainer}>
      <div className={styles.screenshotBackground}>
        <img src={tvGuidePreview} alt="App Screenshot" />
      </div>
      <div className={styles.contentOverlay}>
        <div className={styles.contentWrapper}>
          <FFTVGLogo size="large" withText />
          <div className={styles.descriptionContainer}>
            <p>
              Having trouble keeping track of which players you have in the
              games on TV?
            </p>
            <h4>We've got you covered.</h4>
          </div>
          <div className={styles.buttonContainer}>
            <LinkButton to="/auth">Sign In</LinkButton>
            <Button link="/auth?register=true">Create Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
