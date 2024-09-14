import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
import Button, { ButtonColor } from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <p className={styles.submessage}>
        It might have been moved or deleted, or you may have mistyped the URL.
      </p>
      <Link to="/">
        <Button color={ButtonColor.PRIMARY}>
          Go back to homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
