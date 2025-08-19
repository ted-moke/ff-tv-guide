import styles from "./Stack.module.css";

export const Stack = ({ children, direction = "column", gap = 0 }: { children: React.ReactNode, direction?: "column" | "row", gap?: number }) => {
  return <div className={`${styles.stack} ${styles[`stack-${direction}` ]}`} style={{ gap: `${gap}rem` }}>{children}</div>;
};
