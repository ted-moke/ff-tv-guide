import React from "react";
import styles from "./HomePage.module.css";
import MatchupGuide from "../features/games/MatchupGuide";

const HomePage: React.FC = () => {

  return (
    <div className={styles["sports-dashboard"]}>
      <main className={styles["main-content"]}>
        <MatchupGuide />
      </main>
    </div>
  );
};

export default HomePage;
