import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from '../../styles/layout.module.css';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className={styles.appLayout}>
      <Sidebar 
        isOpenMobile={mobileMenuOpen} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
      />
      
      {/* Mobile overlay */}
      <div 
        className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileOverlayActive : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <main className={styles.mainContent}>
        <Header 
          onMenuToggle={toggleMobileMenu} 
        />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
