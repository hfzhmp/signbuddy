import { motion as Motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div 
      onClick={toggleTheme}
      className={`
        relative w-20 h-10 rounded-full cursor-pointer p-1 shadow-inner transition-colors duration-500 overflow-hidden border border-white/10
        ${isDarkMode ? 'bg-slate-800' : 'bg-sky-400'}
      `}
    >
      {/* --- BACKGROUND ELEMENTS (Awan & Bintang) --- */}
      
      {/* BINTANG (Muncul pas Dark Mode) */}
      <Motion.div 
        initial={false}
        animate={{ opacity: isDarkMode ? 1 : 0, y: isDarkMode ? 0 : 10 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-2 left-8 w-1 h-1 bg-white rounded-full opacity-80" />
        <div className="absolute top-5 left-5 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
        <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
      </Motion.div>

      {/* AWAN (Muncul pas Light Mode) */}
      <Motion.div 
        initial={false}
        animate={{ opacity: isDarkMode ? 0 : 1, y: isDarkMode ? 10 : 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute -bottom-2 right-6 w-6 h-6 bg-white/30 rounded-full blur-[1px]" />
        <div className="absolute -bottom-1 right-2 w-7 h-7 bg-white/40 rounded-full blur-[1px]" />
        <div className="absolute -bottom-3 right-9 w-5 h-5 bg-white/30 rounded-full blur-[1px]" />
      </Motion.div>

      {/* --- KNOB (Matahari / Bulan) --- */}
      <Motion.div
        className="w-8 h-8 rounded-full shadow-md relative z-10"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        animate={{ 
          x: isDarkMode ? 40 : 0,
          backgroundColor: isDarkMode ? '#E2E8F0' : '#FCD34D' // Slate-200 (Moon) vs Yellow-300 (Sun)
        }}
      >
        {/* KAWAH BULAN (Craters) - Cuma muncul di Dark Mode */}
        <Motion.div 
            animate={{ opacity: isDarkMode ? 1 : 0 }}
            className="absolute inset-0"
        >
            <div className="absolute top-1 right-2 w-2 h-2 bg-slate-400/30 rounded-full" />
            <div className="absolute bottom-2 right-3 w-1.5 h-1.5 bg-slate-400/30 rounded-full" />
            <div className="absolute bottom-3 left-2 w-1 h-1 bg-slate-400/30 rounded-full" />
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default ThemeToggle;