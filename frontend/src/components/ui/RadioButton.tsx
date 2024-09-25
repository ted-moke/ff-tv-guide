import React from "react";
import styles from "./RadioButton.module.css";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label?: string;
  labelContent?: React.ReactNode;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  labelContent,
}) => {
  return (
    <div
      className={`${styles.radioContainer} ${checked ? styles.checked : ""}`}
    >
      <label htmlFor={id} className={styles.radioLabel}>
        {labelContent || label}
      </label>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.radioInput}
      />
    </div>
  );
};

export default RadioButton;
