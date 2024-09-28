import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

export enum ButtonColor {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  CLEAR = "clear",
  DANGER = "danger", // Add danger variant
}

type ButtonColorStr = "primary" | "secondary" | "clear" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  link?: string;
  color?: ButtonColorStr;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  link,
  onClick,
  color = ButtonColor.PRIMARY,
  children,
  outline = false,
  disabled,
  ...props
}) => {
  const buttonClass = `${styles[color]} ${styles.button} ${disabled ? styles.disabled : ""} ${outline ? styles.outline : ""}`;

  if (link) {
    return (
      <Link
        to={link}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className={`${buttonClass} ${styles.buttonInLink}`}
          onClick={onClick}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
