import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Terjemah', path: '/terjemah' },
  { name: 'Kamus', path: '/kamus' },
];

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();



  // State untuk animasi bubble (Versi Ringan/CSS)
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    const currentTab = tabsRef.current[activeIndex];

    if (currentTab) {
      setBubbleStyle({
        left: currentTab.offsetLeft,
        width: currentTab.clientWidth,
        opacity: 1,
      });
    } else {
      setBubbleStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname]);

  return (
    // Container: Fixed, Full Width, tapi pointer-events-none biar tembus pandang
    <nav className="fixed top-6 left-0 right-0 z-50 justify-center pointer-events-none h-14 hidden md:flex">
      
      {/* MENU TENGAH (Pointer events auto biar bisa diklik) */}
      <div className={`
        backdrop-blur-md p-1.5 rounded-full shadow-soft border flex items-center pointer-events-auto transition-colors duration-300 relative z-10
        ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white/50'}
      `}>
        
        {/* BUBBLE ANIMATION */}
        <div
          className="absolute bg-brand-main rounded-full shadow-glow h-[calc(100%-12px)] top-1.5 bottom-1.5 z-0"
          style={{
            left: `${bubbleStyle.left}px`,
            width: `${bubbleStyle.width}px`,
            opacity: bubbleStyle.opacity,
            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' 
          }}
        />

        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`
                relative px-6 py-2 rounded-full text-sm font-medium z-10 transition-colors duration-200 block
                ${isActive ? 'text-white' : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;