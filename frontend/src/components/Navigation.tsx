import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import Button, { ButtonColor } from "./Button";
import LinkButton from "./LinkButton";
import { useAuth } from "../features/auth/useAuth";
import { FaBars, FaTimes } from "react-icons/fa";
import { useView } from "../features/view/ViewContext";
import FFTVGLogo from "../assets/FFTVGLogo";

const Navigation: React.FC = () => {
  const { logout } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useView();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>
      <Link to="/home">
        <div className={styles.branding}>
          <FFTVGLogo withText />
        </div>
      </Link>

      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop menu */}
      <div className={styles.desktopMenu}>
        <Button color={ButtonColor.CLEAR} link="/connect-team">
          Connect a League
        </Button>
        <LinkButton onClick={logout}>
          Logout
        </LinkButton>
      </div>
    </nav>
  );
};

export default Navigation;
