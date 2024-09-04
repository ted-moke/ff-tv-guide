import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ id, value, onChange, options }) => {
  return (
    <select id={id} value={value} onChange={onChange} className={styles.dropdown}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;