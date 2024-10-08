import React from "react";
import styles from "./AuthForms.module.css";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";

interface RegisterFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  isWorking: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  error,
  isWorking,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={isWorking}>
        {isWorking ? "Working..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
