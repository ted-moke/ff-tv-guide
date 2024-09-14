import React from 'react';
import styles from './TextInput.module.css';

interface TextInputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  id: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ 
  type, 
  id, 
  name, 
  value, 
  placeholder, 
  onChange, 
  label,
  required,
  className
}) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className={`${styles.input} ${className || ''}`}
      />
    </div>
  );
};

export default TextInput;