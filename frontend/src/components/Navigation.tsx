import React from "react";
import styles from "./Navigation.module.css";
import Button, { ButtonColor } from "./ui/Button";
import LinkButton from "./ui/LinkButton";
import { useAuthContext } from "../features/auth/AuthProvider2";

import { LuMenu as Menu, LuX as Close } from "react-icons/lu";
import { useView } from "../features/view/ViewContext";
import FFTVGLogo from "../assets/FFTVGLogo";

const Navigation: React.FC = () => {

  const { logout } = useAuthContext();
  const { isMenuOpen, setIsMenuOpen } = useView();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>

      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <Close size={20} /> : <Menu size={20} color="var(--text-color)" />}
      </div>
      <div className={styles.branding}>
        <FFTVGLogo size="xsmall" />
      </div>

      {/* Desktop menu */}
      <div className={styles.desktopMenu}>
        <Button color={ButtonColor.CLEAR} link="/connect-team">
          Connect a League
        </Button>
        <LinkButton onClick={logout}>Logout</LinkButton>
      </div>
    </nav>
  );
};

export default Navigation;
