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
            Drowning in apps while trying to watch the games? See all your fantasy players at a glance, organized by NFL game.
          </p>
          <h4>Let us guide your Gameday.</h4>
        </div>
        <div className={styles.buttonContainer}>
          <Button link="/connect-team">
            Connect a League
          </Button>
          <p>or if you want the full experience cross devices</p>
          <div className={styles.secondaryButtons}>
            <LinkButton to="/auth" >
              Sign In
            </LinkButton>
            <Button outline link="/auth?register=true"  >
              Create Account
            </Button>
          </div>
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
