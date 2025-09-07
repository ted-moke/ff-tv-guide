import React from "react";
import styles from "./LeagueCards.module.css";
import { LeagueCard } from "./LeagueCard";
import { useLeagueCards } from "./useLeagueCards";

export const LeagueCardsSection: React.FC = () => {
  const {
    leagueCardsData,
    toggleCardExpansion,
  } = useLeagueCards();

  if (!leagueCardsData || leagueCardsData.length === 0) {
    return null;
  }

  return (
    <div className={styles.leagueCardsSection}>
      <h2 className={styles.sectionTitle}>My Leagues</h2>
      <div className={styles.leagueCardsGrid}>
        {leagueCardsData.map((cardData) => (
          <LeagueCard
            key={cardData.team.id}
            cardData={cardData}
            onToggleExpansion={toggleCardExpansion}
          />
        ))}
      </div>
    </div>
  );
};
