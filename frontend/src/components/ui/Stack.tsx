import styles from "./Stack.module.css";

export const Stack = ({
  children,
  direction = "column",
  gap = 0.5,
  align = "start",
  justify = "start",
  className,
  onClick,
}: {
  children: React.ReactNode;
  direction?: "column" | "row";
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}  // TODO fix this, shouldn't have a click on a div
      className={`${styles.stack} ${styles[`stack-${direction}`]} ${className}`}
      style={{ gap: `${gap}rem`, alignItems: align, justifyContent: justify }}
    >
      {children}
    </div>
  );
};
