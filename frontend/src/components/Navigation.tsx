import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import logo from "/vite.svg";
import Button, { ButtonColor } from "./Button";

const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <Link to="/home">
        <div className={styles.branding}>
          <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
          <h1 className={styles.title}>FF TV Guide</h1>
        </div>
      </Link>

      <ul>
        <li>
          <Button color={ButtonColor.CLEAR} link="/connect-team">Connect Team</Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
