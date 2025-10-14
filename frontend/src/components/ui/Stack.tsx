import styles from "./Stack.module.css";

export const Stack = ({
  children,
  direction = "column",
  gap = 0.5,
  align = "start",
  justify = "start",
  className,
  onClick,
  fullHeight,
  fullWidth,
  wrap,
}: {
  children: React.ReactNode;
  direction?: "column" | "row";
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justify?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "around"
    | "space-evenly";
  className?: string;
  fullHeight?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  wrap?: boolean;
}) => {
  return (
    <div
      onClick={onClick} // TODO fix this, shouldn't have a click on a div
      className={`${styles.stack} ${
        styles[`stack-${direction}`]
      } ${className} ${!!fullHeight ? styles.fullHeight : ""} ${
        !!fullWidth ? styles.fullWidth : ""
      } ${!!wrap ? styles.wrap : ""} `}
      style={{ gap: `${gap}rem`, alignItems: align, justifyContent: justify }}
    >
      {children}
    </div>
  );
};
