import Navbar from '../components/common/Navbar';
import RegisterForm from '../components/RegisterForm';
import styles from '../styles/HomePage.module.css';

export default function Register() {
  return (
    <div className={styles.container}>
      <Navbar />
      <RegisterForm />
    </div>
  );
}