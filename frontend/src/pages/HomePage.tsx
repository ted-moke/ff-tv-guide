import React from "react";
import styles from "./HomePage.module.css";
import MatchupGuide from "../features/games/MatchupGuide";
import { useView } from "../features/view/ViewContext";

const HomePage: React.FC = () => {
  const {
    selectedWeek,
    setSelectedWeek,
  } = useView();

  if (!selectedWeek) {
    return <div>No games scheduled for this week.</div>;
  }

  return (
    <div className={styles["sports-dashboard"]}>
      <main className={styles["main-content"]}>
        <MatchupGuide
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      </main>
    </div>
  );
};

export default HomePage;
