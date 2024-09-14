import { LuTv } from "react-icons/lu";
import styles from "./FFTVGLogo.module.css";
import { Link } from "react-router-dom";

const sizeMap = {
  small: {
    fontSize: 44,
    className: styles.small,
  },
  large: {
    fontSize: 72,
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
  const fontSize = sizeMap[size].fontSize;
  const className = sizeMap[size].className;

  return (
    <Link to="/">
      <div className={`${styles.logoWrapper} ${className}`}>
        <div className={styles.logoContainer}>
          <LuTv fontSize={fontSize} color="var(--primary-color)" />
          <h1 className={styles.logoText}>FF</h1>
        </div>
        {withText && <h1 className={styles.text}>TV Guide</h1>}
      </div>
    </Link>
  );
};

export default FFTVGLogo;
