import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import logo from "/vite.svg"; // Ensure the path to the logo is correct
import Button from "./Button";
import LinkButton from "./LinkButton";
import TextInput from "./TextInput";
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    register({ username, email, password }, {
      onError: (error: Error) => setError(error.message),
    });
  };

  return (
    <div className="container">
      <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
      <h1>Create Your Account</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <TextInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <TextInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <TextInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit">Register</Button>
      </form>
      <div className={styles.linkContainer}>
        <LinkButton to="/login">Already have an account? Sign In</LinkButton>
      </div>
    </div>
  );
};

export default RegisterPage;
