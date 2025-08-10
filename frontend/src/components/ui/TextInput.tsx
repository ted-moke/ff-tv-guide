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
  outline?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
  className,
  outline = false,
  icon,
  iconPosition = 'left'
}) => {
  return (
    <div className={`${styles.inputContainer} ${outline ? styles.outline : ''}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      {icon && iconPosition === 'left' && <div className={styles.icon}>{icon}</div>}
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
      {icon && iconPosition === 'right' && <div className={styles.icon}>{icon}</div>}
      </div>
  );
};

export default TextInput;