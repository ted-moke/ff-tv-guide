import React from "react";
import styles from "./HomePage.module.css";
import MatchupGuide from "../features/games/MatchupGuide";
import HomeOffseason from "./HomeOffseason";
import { useView } from "../features/view/ViewContext";

const HomePage: React.FC = () => {
  const {
    selectedWeek,
    setSelectedWeek,
  } = useView();

  if (!selectedWeek) {
    return <HomeOffseason />;
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
