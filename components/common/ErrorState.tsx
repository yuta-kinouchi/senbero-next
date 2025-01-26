// components/ErrorState.tsx
import styles from '@/styles/HomePage.module.css';
import Navbar from './Navbar';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className={styles.container}>
    <Navbar />
    <div className={styles.errorContainer}>
      <p>Error: {error}</p>
    </div>
  </div>
);