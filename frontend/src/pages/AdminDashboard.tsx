import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet and Link
import LinkButton from "../components/ui/LinkButton";
import styles from "./AdminDashboard.module.css";

const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
      </div>
      <div className={styles.nav}>
        <LinkButton to="leagues">Leagues</LinkButton>
        <LinkButton to="userTeams">User Teams</LinkButton>
      </div>
      <div className={styles.content}>
        <Outlet /> {/* This is where nested routes will be rendered */}
      </div>
    </div>
  );
};

export default AdminDashboard;
