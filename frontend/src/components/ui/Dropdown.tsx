import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  className,
  required 
}) => {
  return (
    <div className={styles.dropdownContainer}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <select 
        id={id} 
        value={value} 
        onChange={onChange} 
        className={`${styles.dropdown} ${className || ''}`}
        required={required}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;