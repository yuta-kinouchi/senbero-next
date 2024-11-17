// components/LoadingState.tsx
import styles from '@/styles/HomePage.module.css';
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar';

export const LoadingState: React.FC = () => (
  <div className={styles.container}>
    <Navbar />
    <div className={styles.loadingContainer}>
      <CircularProgress />
    </div>
  </div>
);