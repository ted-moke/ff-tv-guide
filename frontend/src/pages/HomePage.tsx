import React from "react";
import styles from "./HomePage.module.css";
import MatchupGuide from "../features/games/MatchupGuide";
import { useView } from "../features/view/ViewContext";

const HomePage: React.FC = () => {
  const {
    activeFantasyTeams,
    selectedWeek,
    setSelectedWeek,
  } = useView();

  return (
    <div className={styles["sports-dashboard"]}>
      <main className={styles["main-content"]}>
        <MatchupGuide
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          activeFantasyTeams={activeFantasyTeams}
        />
      </main>
    </div>
  );
};

export default HomePage;
