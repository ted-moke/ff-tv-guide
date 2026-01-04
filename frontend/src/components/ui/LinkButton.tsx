import React from "react";
import { Link } from "react-router-dom";
import styles from "./LinkButton.module.css";

export enum LinkButtonColor {
  DEFAULT = "default",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  MUTED = "muted",
  BLACK = "black",
}

const getLinkButtonClass = (color: LinkButtonColor) => {
  switch (color) {
    case LinkButtonColor.PRIMARY:
      return styles.primaryLinkButton;
    case LinkButtonColor.SECONDARY:
      return styles.secondaryLinkButton;
    case LinkButtonColor.MUTED:
      return styles.mutedLinkButton;
    case LinkButtonColor.BLACK:
      return styles.blackLinkButton;
    default:
      return "";
  }
};

interface LinkButtonProps {
  to?: string;
  color?: LinkButtonColor;
  children: React.ReactNode;
  underline?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  target?: "_blank" | "_self" | "_parent" | "_top";
  size?: "small" | "medium" | "large";
  pY?: "none" | "medium";
  pX?: "none" | "medium";
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  color = LinkButtonColor.DEFAULT,
  children,
  onClick,
  size = "medium",
  underline = true,
  type = "button",
  target = "_self",
  pY = "medium",
  pX = "medium",
}) => {
  const linkButtonClass = getLinkButtonClass(color);
  const pYClass = `pY${pY}`;
  const pXClass = `pX${pX}`;

  const buttonElement = (
    <button
      className={`${styles.linkButton} ${linkButtonClass} ${
        underline ? styles.underline : ""
      } ${styles[size]} ${styles[pYClass]} ${styles[pXClass]}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );

  return to ? (
    <Link to={to} className={styles.link} target={target}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );
};

export default LinkButton;
