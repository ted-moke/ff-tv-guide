import React from "react";
import { Link } from "react-router-dom";
import styles from "./LinkButton.module.css";

export enum LinkButtonColor {
  DEFAULT = "default",
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

const getLinkButtonClass = (color: LinkButtonColor) => {
  switch (color) {
    case LinkButtonColor.PRIMARY:
      return styles.primaryLinkButton;
    case LinkButtonColor.SECONDARY:
      return styles.secondaryLinkButton;
    default:
      return "";
  }
};

interface LinkButtonProps {
  to?: string;
  color?: LinkButtonColor;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  color = LinkButtonColor.DEFAULT,
  children,
  onClick,
}) => {
  const linkButtonClass = getLinkButtonClass(color);

  const buttonElement = (
    <button
      className={`${styles.linkButton} ${linkButtonClass}`}
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
