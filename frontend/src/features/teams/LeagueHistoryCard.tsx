import { TeamHistoryData } from "../../types/shared";
import styles from "./LeagueHistoryCard.module.css";


export const LeagueHistoryCard = ({
  leagueData,
}: {
  leagueData: TeamHistoryData[];
}) => {

    const singleLeagueData = leagueData[0];
  return (
    <div key={singleLeagueData.leagueMaster.id} className={styles.leagueCard}>
      <div className={styles.leagueHeader}>
        <h2 className={styles.leagueName}>{singleLeagueData.leagueMaster.name}</h2>
        <span className={styles.platformBadge}>
          {singleLeagueData.leagueMaster.platform.name}
        </span>
      </div>

      <div className={styles.seasonsGrid}>
        {singleLeagueData.seasons.map((seasonData) => (
          <div
            key={`${singleLeagueData.leagueMaster.id}-${seasonData.season}`}
            className={styles.seasonCard}
          >
            <div className={styles.seasonHeader}>
              <span className={styles.seasonYear}>{seasonData.season}</span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Record</span>
                <div className={`${styles.record} ${styles.statValueLarge}`}>
                  <span className={styles.wins}>{seasonData.stats.wins}W</span>
                  <span className={styles.losses}>
                    {seasonData.stats.losses}L
                  </span>
                  {seasonData.stats.ties > 0 && (
                    <span className={styles.ties}>
                      {seasonData.stats.ties}T
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Win %</span>
                <span
                  className={`${styles.statValue} ${
                    styles.statValueLarge
                  } ${(() => {
                    const winPercentage =
                      seasonData.stats.wins +
                        seasonData.stats.losses +
                        seasonData.stats.ties >
                      0
                        ? (seasonData.stats.wins /
                            (seasonData.stats.wins +
                              seasonData.stats.losses +
                              seasonData.stats.ties)) *
                          100
                        : 0;
                    if (winPercentage > 50) return styles.winPercentageGood;
                    if (winPercentage < 50) return styles.winPercentageBad;
                    return styles.winPercentageNeutral;
                  })()}`}
                >
                  {seasonData.stats.wins +
                    seasonData.stats.losses +
                    seasonData.stats.ties >
                  0
                    ? (
                        (seasonData.stats.wins /
                          (seasonData.stats.wins +
                            seasonData.stats.losses +
                            seasonData.stats.ties)) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points For</span>
                <span className={styles.statValue}>
                  {seasonData.stats.pointsFor.toFixed(1)}
                </span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points Against</span>
                <span className={styles.statValue}>
                  {seasonData.stats.pointsAgainst.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
