import React from 'react';
import styles from './HomePage.module.css';
import MatchupGuide from '../features/games/MatchupGuide';
import Overview from './Overview';
import { useView } from '../features/view/ViewContext';

const HomePage: React.FC = () => {
  const {
    viewMode,
    activeFantasyTeams,
    activeConference,
    sortBy,
    hideEmptyTeams,
    selectedWeek,
    setSelectedWeek,
  } = useView();

  return (
    <div className={styles['sports-dashboard']}>
      <main className={styles['main-content']}>
        {viewMode === 'overview' ? (
          <Overview
            activeFantasyTeams={activeFantasyTeams}
            activeConference={activeConference}
            sortBy={sortBy}
            hideEmptyTeams={hideEmptyTeams}
          />
        ) : (
          <MatchupGuide
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            activeFantasyTeams={activeFantasyTeams}
          />
        )}
      </main>
    </div>
  );
}

export default HomePage;