import React from "react";
import styles from "./LeagueCardsSection.module.css";
import { LeagueCard } from "./LeagueCard";
import { useLeagueCards } from "../useLeagueCards";
import { useView } from "../../view/ViewContext";

export const LeagueCardsSection: React.FC = () => {
  const {
    leagueCardsData,
    toggleCardExpansion,
  } = useLeagueCards();
  const { selectedWeek, hasWeekStarted } = useView();

  if (!leagueCardsData || leagueCardsData.length === 0) {
    return null;
  }

  return (
    <div className={styles.leagueCardsSection} data-section="league-cards">
      <h2 className={styles.sectionTitle}>My Leagues - Week {selectedWeek}</h2>
      <div className={styles.leagueCardsGrid}>
        {leagueCardsData.map((cardData) => (
          <LeagueCard
            key={cardData.team.id}
            cardData={cardData}
            onToggleExpansion={toggleCardExpansion}
            hasWeekStarted={hasWeekStarted}
          />
        ))}
      </div>
    </div>
  );
};
