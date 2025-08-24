import styles from "./Stack.module.css";

export const Stack = ({
  children,
  direction = "column",
  gap = 0.5,
  align = "start",
  justify = "start",
  className,
}: {
  children: React.ReactNode;
  direction?: "column" | "row";
  gap?: number;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
}) => {
  return (
    <div
      className={`${styles.stack} ${styles[`stack-${direction}`]} ${className}`}
      style={{ gap: `${gap}rem`, alignItems: align, justifyContent: justify }}
    >
      {children}
    </div>
  );
};
