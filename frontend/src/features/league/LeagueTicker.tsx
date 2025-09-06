import { useView } from "../view/ViewContext";
import styles from "./LeagueTicker.module.css";
import { CURRENT_SEASON } from "../../constants";

export const LeagueTicker = () => {
  const { userTeams } = useView();

  if (!userTeams || Object.keys(userTeams).length === 0) return null;

  return (
    <div className={`${styles.leagueTickerWrapper} ${styles.scrollContainer} ${styles.withGradient} ${styles.scrollbar} ${styles.scrollbarInvisible}`}>
      <div
        className={`${styles.leagueTickerContainer} ${styles.scrollbarInvisible}`}
      >
        {Object.values(userTeams[CURRENT_SEASON]).map((team) => {
          const winning =
            team.weekPoints != null &&
            team.weekPointsAgainst != null &&
            team.weekPoints > team.weekPointsAgainst;
          const losing =
            team.weekPoints != null &&
            team.weekPointsAgainst != null &&
            team.weekPoints < team.weekPointsAgainst;
          return (
            <div
              key={team.id}
              className={`${styles.leagueTickerItem} ${
                winning ? styles.winning : losing ? styles.losing : styles.tied
              }`}
            >
              <h3 className={styles.shortLeagueName}>{team.shortLeagueName}</h3>
              <div className={styles.leagueTickerItemSubContent}>
                <p className={styles.weekPoints}>
                  {team.weekPoints?.toFixed(2)}
                </p>
                <span>v</span>
                <p className="muted">{team.weekPointsAgainst?.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
