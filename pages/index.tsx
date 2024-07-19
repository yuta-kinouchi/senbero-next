import Navbar from '../components/Navbar';
import SearchForm from '../components/SearchForm';
import styles from '../styles/HomePage.module.css';


const HomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <SearchForm />
    </div>
  );
};

export default HomePage;