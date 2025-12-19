import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MobileNav = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Terjemah', path: '/terjemah', icon: Camera },
    { name: 'Kamus', path: '/kamus', icon: BookOpen },
  ];

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-[100] md:hidden 
      border-t pb-safe pt-2 px-6 h-20 flex items-start justify-between
      backdrop-blur-xl transition-colors duration-300
      ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'}
    `}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300
              ${isActive 
                ? (isDarkMode ? 'text-blue-400' : 'text-brand-main') 
                : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
              }
            `}
          >
            <div className={`
              p-2 rounded-2xl transition-all duration-300
              ${isActive && (isDarkMode ? 'bg-blue-500/10' : 'bg-brand-main/10')}
            `}>
              <Icon 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`w-6 h-6 ${isActive && 'scale-110'}`} 
              />
            </div>
            <span className="text-[10px] font-medium tracking-wide">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNav;
