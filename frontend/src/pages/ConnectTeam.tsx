import React from 'react';
import ConnectTeamForm from '../features/connect/ConnectTeamForm';
import styles from './ConnectTeam.module.css';

const ConnectTeam: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect Your Fantasy Team</h1>
      <ConnectTeamForm />
    </div>
  );
};

export default ConnectTeam;