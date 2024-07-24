import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';
import styles from '../styles/HomePage.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <Navbar />
      <LoginForm />
    </div>
  );
}