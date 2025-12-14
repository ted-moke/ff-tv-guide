import { LuTv } from "react-icons/lu";
import styles from "./FFTVGLogo.module.css";
import { Link } from "react-router-dom";

const sizeMap = {
  xxsmall: {
    logoFontSize: 24,
    className: styles.xxsmall,
  },
  xsmall: {
    logoFontSize: 32,
    className: styles.xsmall,
  },
  small: {
    logoFontSize: 46,
    className: styles.small,
  },
  large: {
    logoFontSize: 72,
    className: styles.large,
  },
};

const FFTVGLogo = ({
  size = "small",
  withText = false,
  withLogoText = true,
  color = "var(--primary-color)",
}: {
  size?: "xxsmall" | "xsmall" | "small" | "large";
  withText?: boolean;
  withLogoText?: boolean;
  color?: string;
}) => {
  const logoFontSize = sizeMap[size].logoFontSize;
  const className = sizeMap[size].className;

  return (
    <Link to="/">
      <div className={`${styles.logoWrapper} ${className}`}>
        <div className={styles.logoContainer}>
          <LuTv fontSize={logoFontSize} color={color} />
          {withLogoText && <h1 className={styles.logoText}>FF</h1>}
        </div>
        {withText && <h1 className={styles.text}>TV Guide</h1>}
      </div>
    </Link>
  );
};

export default FFTVGLogo;
