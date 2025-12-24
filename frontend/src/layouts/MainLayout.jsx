import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children, showFooter = true }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
