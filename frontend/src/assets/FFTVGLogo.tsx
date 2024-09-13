import { LuTv } from "react-icons/lu";
import styles from "./FFTVGLogo.module.css";

const sizeMap = {
  small: {
    fontSize: 40,
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
    <div className={`${styles.logoWrapper} ${className}`}>
      <div className={styles.logoContainer}>
        <LuTv fontSize={fontSize} />
        <h1 className={styles.logoText}>FF</h1>
      </div>
      {withText && <h1 className={styles.text}>TV Guide</h1>}
    </div>
  );
};

export default FFTVGLogo;
