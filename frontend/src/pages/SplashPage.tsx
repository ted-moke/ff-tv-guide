import React from "react";
import styles from "./SplashPage.module.css";
import Button from "../components/ui/Button";
import LinkButton from "../components/ui/LinkButton";
import FFTVGLogo from "../assets/FFTVGLogo";
import ssSingleMatch from "../assets/ss-single-match.png";

const SplashPage: React.FC = () => {
  return (
    <div className={styles.splashContainer}>
      <div className={styles.contentWrapper}>
        <FFTVGLogo size="large" withText />
        <div className={styles.descriptionContainer}>
          <p>
            Having trouble keeping track of which players you have in the games
            on TV?
          </p>
          <h4>We've got you covered.</h4>
        </div>
        <div className={styles.buttonContainer}>
          <LinkButton to="/auth">Sign In</LinkButton>
          <Button link="/auth?register=true">Create Account</Button>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.keyFeatures}>
            <h3>Key Features:</h3>
            <ul>
              <li>
                Connect your fantasy leagues from Sleeper and Fleaflicker (more
                to come)
              </li>
              <li>See which NFL games you have the most players in</li>
              <li>Double check your bench players</li>
            </ul>
          </div>
          <div className={styles.previewContainer}>
            <img
              src={ssSingleMatch}
              alt="TV Guide Preview"
              className={styles.previewImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
