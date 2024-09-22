import { LuTv } from "react-icons/lu";
import styles from "./FFTVGLogo.module.css";
import { Link } from "react-router-dom";

const sizeMap = {
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
}: {
  size?: "small" | "large";
  withText?: boolean;
}) => {
  const logoFontSize = sizeMap[size].logoFontSize;
  const className = sizeMap[size].className;

  return (
    <Link to="/">
      <div className={`${styles.logoWrapper} ${className}`}>
        <div className={styles.logoContainer}>
          <LuTv fontSize={logoFontSize} color="var(--primary-color)" />
          <h1 className={styles.logoText}>FF</h1>
        </div>
        {withText && <h1 className={styles.text}>TV Guide</h1>}
      </div>
    </Link>
  );
};

export default FFTVGLogo;
