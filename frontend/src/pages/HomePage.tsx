import React from "react";
import styles from "./HomePage.module.css";
import MatchupGuide from "../features/games/MatchupGuide";

const HomePage: React.FC = () => {

  return (
    <div className={styles["home-wrapper"]}>
      <main className={styles["home-content"]}>
        <MatchupGuide />
      </main>
    </div>
  );
};

export default HomePage;
