import React from 'react';
import styles from './TextInput.module.css';

interface TextInputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  id: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ type, id, name, value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={styles.input}
    />
  );
};

export default TextInput;