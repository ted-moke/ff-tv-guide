import React from "react";
import styles from "./Navigation.module.css";

import { LuMenu as Menu, LuX as Close } from "react-icons/lu";
import { useView } from "../features/view/ViewContext";
import FFTVGLogo from "../assets/FFTVGLogo";

const Navigation: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useView();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>
      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <Close size={20} /> : <Menu size={20} color="var(--text-color)" />}
      </div>
      <div className={styles.branding}>
        <FFTVGLogo size="xsmall" withText />
      </div>
    </nav>
  );
};

export default Navigation;
