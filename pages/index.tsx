import Navbar from '../components/common/Navbar';
import SearchForm from '../components/restaurant/SearchForm';
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