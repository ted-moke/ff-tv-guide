import React from "react";
import { Link } from "react-router-dom";
import styles from "./LinkButton.module.css";

export enum LinkButtonColor {
  DEFAULT = "default",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  MUTED = "muted",
}

const getLinkButtonClass = (color: LinkButtonColor) => {
  switch (color) {
    case LinkButtonColor.PRIMARY:
      return styles.primaryLinkButton;
    case LinkButtonColor.SECONDARY:
      return styles.secondaryLinkButton;
    case LinkButtonColor.MUTED:
      return styles.mutedLinkButton;
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
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  color = LinkButtonColor.DEFAULT,
  children,
  onClick,
  underline = true,
}) => {
  const linkButtonClass = getLinkButtonClass(color);

  const buttonElement = (
    <button
      className={`${styles.linkButton} ${linkButtonClass} ${underline ? styles.underline : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return to ? (
    <Link to={to} className={styles.link}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );
};

export default LinkButton;