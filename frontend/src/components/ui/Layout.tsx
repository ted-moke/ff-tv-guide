import React from "react";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import styles from "./Layout.module.css";
import { useView } from "../../features/view/ViewContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile, isMenuOpen } = useView();

  return (
    <div className={`${styles["app-container"]} ${isMenuOpen ? styles["sidebar-open"] : ""}`}>
      {isMobile && (
        <div className={styles["header"]}>
          <Navigation />
        </div>
      )}
      <div className={styles["sidebar-container"]}>
        <Sidebar />
      </div>
      <div className={styles["content"]}>{children}</div>
    </div>
  );
};

export default Layout;
