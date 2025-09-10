import React from "react";
import styles from "./Navigation.module.css";

import { LuMenu as Menu, LuX as Close } from "react-icons/lu";
import { useView } from "../features/view/ViewContext";
import FFTVGLogo from "../assets/FFTVGLogo";
import { LeagueTicker } from "../features/league/LeagueTicker";
import { useLeagueTickerVisibility } from "../features/league/useLeagueTickerVisibility";

const Navigation: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useView();
  const isTickerVisible = useLeagueTickerVisibility();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>

      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <Close size={20} /> : <Menu size={20} color="var(--text-color)" />}
      </div>
      <div className={styles.branding}>
        <FFTVGLogo size="xsmall" />
      </div>
      {isTickerVisible && <LeagueTicker />}
    </nav>
  );
};

export default Navigation;
