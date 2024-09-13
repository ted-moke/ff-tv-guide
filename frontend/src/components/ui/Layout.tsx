import React from "react";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import styles from "./Layout.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles["app-container"]}>
      <div className={styles["header"]}>
        <Navigation />
      </div>
      <div className={styles["sidebar-container"]}>
        <Sidebar />
      </div>
      <div className={styles["content"]}>{children}</div>
    </div>
  );
};

export default Layout;
