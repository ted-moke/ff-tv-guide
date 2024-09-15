import React from "react";
import styles from "./Navigation.module.css";
import Button, { ButtonColor } from "./ui/Button";
import LinkButton from "./ui/LinkButton";
import { useAuth } from "../features/auth/useAuth";
import { LuMenu as Menu, LuX as Close } from "react-icons/lu";
import { useView } from "../features/view/ViewContext";
import FFTVGLogo from "../assets/FFTVGLogo";

const Navigation: React.FC = () => {
  const { logout } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useView();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navigation}>
      <div className={styles.branding}>
        <FFTVGLogo withText />
      </div>

      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <Close /> : <Menu color="var(--text-color)" />}
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
