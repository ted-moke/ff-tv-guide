import React from 'react';
import styles from './RegisterPage.module.css';
import logo from '/vite.svg'; // Ensure the path to the logo is correct
import Button from './Button';
import LinkButton from './LinkButton';

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src={logo} alt="FF TV Guide Logo" className={styles.logo} />
      <h1>Create Your Account</h1>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input type="text" id="username" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input type="email" id="email" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input type="password" id="password" className={styles.input} />
        </div>
        <Button type="submit">Register</Button>
      </form>
      <div className={styles.linkContainer}>
        <LinkButton to="/login">Already have an account? Sign In</LinkButton>
      </div>
    </div>
  );
};

export default RegisterPage;