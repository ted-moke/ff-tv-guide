import React from "react";
import LeagueList from "../features/league/LeagueList";
import { LeagueStats, MigrationTools } from "../features/admin";
import styles from "./AdminLeagues.module.css";

const AdminLeagues: React.FC = () => {
  return (
    <div className={styles.adminLeagues}>
      <LeagueStats />
      <MigrationTools />
      <LeagueList />
    </div>
  );
};

export default AdminLeagues;
