import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ThemeToggle from '../components/ThemeToggle'; 
import { useTheme } from '../context/ThemeContext'; 
import MobileNav from '../components/MobileNav';

const Layout = ({ children }) => {
  const location = useLocation();
  const mainContainerRef = useRef(null);
  const { isDarkMode } = useTheme(); 

  const hideFooterPaths = ['/terjemah'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div
      id="main-scroll-container"
      ref={mainContainerRef}
      // OPTIMASI 1: Kurangi durasi transisi background dari 500ms ke 300ms
      // Hapus 'transition-colors' kalau masih berat, biar warnanya ganti instan.
        className={`
          relative w-full h-screen scrollbar-hide transition-colors duration-300 ease-in-out pb-36 md:pb-0
          ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#eff6ff] text-slate-800'}
          overflow-y-auto scroll-smooth
        `}
    >
      {/* MOBILE NAV (Bottom Fixed) */}
      <MobileNav />

      {/* BACKGROUND BLOBS (OPTIMIZED) */}
      {/* will-change-transform membantu browser menyiapkan layer GPU */}
      <div 
        className={`fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl -z-10 pointer-events-none transition-opacity duration-500 will-change-transform ${isDarkMode ? 'bg-blue-900/20 opacity-50' : 'bg-blue-200/40 opacity-100'}`} 
      />
      <div 
        className={`fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl -z-10 pointer-events-none transition-opacity duration-500 will-change-transform ${isDarkMode ? 'bg-brand-main/10 opacity-40' : 'bg-brand-main/20 opacity-100'}`} 
      />

      {/* --- HEADER ZONE --- */}

      {/* 1. LOGO (Visible on Mobile & Desktop, different positions if needed) */}
      <Link to="/" className="fixed top-4 left-6 md:top-8 md:left-10 z-50 flex items-center gap-2 cursor-pointer group">
        <img 
          src="/logo.png" 
          alt="SignBuddy Logo" 
          className={`h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${isDarkMode ? 'brightness-0 invert' : ''}`} 
        />
      </Link>

      {/* 2. NAVBAR (Hidden on Mobile via CSS inside Navbar component) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      {/* 3. TOGGLE TEMA (Visible on Mobile & Desktop) */}
      <div className="fixed top-4 right-6 md:top-8 md:right-10 z-50 pointer-events-auto">
        <ThemeToggle />
      </div>

      {/* --- CONTENT ZONE --- */}
      <main className="pt-24 md:pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-0">
        {children}
      </main>

      {!shouldHideFooter && <Footer />}
      {!shouldHideFooter && <ScrollToTop containerId="main-scroll-container" />}

      {/* COPYRIGHT */}
      <div className={`fixed bottom-4 right-6 z-40 text-xs font-bold tracking-widest select-none pointer-events-none transition-colors duration-300 ${isDarkMode ? 'text-white/10' : 'text-brand-text/20 mix-blend-multiply'}`}>
        copyright@hfzhmp
      </div>
    </div>
  );
};

export default Layout;