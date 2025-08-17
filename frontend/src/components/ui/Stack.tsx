import styles from "./Stack.module.css";

export const Stack = ({ children, direction = "column" }: { children: React.ReactNode, direction?: "column" | "row" }) => {
  return <div className={`${styles.stack} ${styles[`stack-${direction}` ]}`}>{children}</div>;
};
