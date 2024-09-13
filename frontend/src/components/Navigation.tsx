import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import logo from "/vite.svg";
import Button, { ButtonColor } from "./Button";
import LinkButton from "./LinkButton";
import { useAuth } from "../features/auth/useAuth";
import { FaBars, FaTimes } from "react-icons/fa";
import { useView } from "../features/view/ViewContext";

const Navigation: React.FC = () => {
  const { logout } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useView();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>
      <Link to="/home">
        <div className={styles.branding}>
          <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
          <h1 className={styles.title}>FF TV Guide</h1>
        </div>
      </Link>

      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop menu */}
      <div className={styles.desktopMenu}>
        <Button color={ButtonColor.CLEAR} link="/connect-team">
          Connect Team
        </Button>
        <LinkButton onClick={logout}>
          Logout
        </LinkButton>
      </div>
    </nav>
  );
};

export default Navigation;
