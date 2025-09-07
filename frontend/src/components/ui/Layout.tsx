import React from "react";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import styles from "./Layout.module.css";
import { useView } from "../../features/view/ViewContext";
import { useAuthContext } from "../../features/auth/AuthProvider2";
import LoadingSpinner from "./LoadingSpinner";
import { Navigate } from "react-router-dom";

const Layout = ({ isAuthBlocking = true, children }: { isAuthBlocking?: boolean, children: React.ReactNode }) => {
  const { isMobile, isMenuOpen } = useView();
  const { user, isLoading: isAuthLoading } = useAuthContext();

  if (isAuthLoading && isAuthBlocking) {
    return <LoadingSpinner />;
  }

  if (!user && isAuthBlocking) {
    console.log("No user, redirecting to connect-team");
    return <Navigate to="/connect-team" />;
  }

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
      <div id="layout-content" className={styles["content"]}>{children}</div>
    </div>
  );
};

export default Layout;
