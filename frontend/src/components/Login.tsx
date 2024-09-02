import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from "./Login.module.css";
import logo from "/vite.svg";
import Button from "./Button";
import LinkButton from "./LinkButton";
import TextInput from "./TextInput";
import LoadingSpinner from "./LoadingSpinner";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
      <h1>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <TextInput
            type="email"
            id="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit">Sign In</Button>
      </form>
      <div className={styles.linkContainer}>
        <LinkButton to="/register">Don't have an account? Sign Up</LinkButton>
      </div>
    </div>
  );
};

export default Login;