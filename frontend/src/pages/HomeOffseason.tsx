import React from "react";
import styles from "./HomeOffseason.module.css";
import FFTVGLogo from "../assets/FFTVGLogo";
import { useNeedsConnect } from "../features/teams/useNeedsConnect";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Navigate } from "react-router-dom";

const HomeOffseason: React.FC = () => {
  const { isLoading: needsConnectLoading, needsConnect } = useNeedsConnect();

  if (needsConnectLoading) {
    return <LoadingSpinner />;
  }

  if (needsConnect) {
    return <Navigate to="/connect-team" />;
  }

  console.log("needsConnect", needsConnect);

  return (
    <div className={styles.offseasonContainer}>
      <div className={styles.contentWrapper}>
        <FFTVGLogo size="large" withText />
        <div className={styles.messageContainer}>
          <h2>🏈 NFL Season is in the Offseason</h2>
          <p>
            The regular NFL season has ended, but your fantasy football journey
            doesn't have to!
          </p>
          <div className={styles.featuresList}>
            <h3>What you can do now:</h3>
            <ul>
              <li>Review your season performance and stats</li>
              <li>Plan your offseason strategy</li>
              <li>Connect additional fantasy platforms</li>
              <li>Prepare for next season's draft</li>
            </ul>
          </div>
          <div className={styles.comingSoon}>
            <h4>Coming Soon:</h4>
            <p>
              Offseason features including season recaps, player analysis, and
              draft preparation tools!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOffseason;
