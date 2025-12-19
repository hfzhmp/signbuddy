import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Footer = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/terjemah', label: 'Terjemah' },
    { path: '/kamus', label: 'Kamus ASL' },
  ];

  return (
    <footer className="w-full mt-20 bg-brand-dark rounded-t-[3rem] relative overflow-hidden text-white">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none mix-blend-soft-light" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-brand-main/20 rounded-full blur-3xl pointer-events-none mix-blend-soft-light" />
      <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16 text-center md:text-left">
          <div className="space-y-5 flex flex-col items-center md:items-start">
            <img src="/logo.png" alt="SignBuddy Logo" className="h-16 md:h-20 w-auto brightness-0 invert" />
            <p className="text-blue-200/80 text-sm leading-relaxed max-w-md">
              Menjembatani komunikasi inklusif melalui teknologi AI. Platform penerjemah dan pembelajaran bahasa isyarat (ASL) untuk semua.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-200/90 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
              <span>Build with LOVE.</span>
            </div>
          </div>

          <div className="md:flex md:justify-end">
            <div className="space-y-6">
              <ul className="space-y-4 flex flex-col items-center md:items-end w-full">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.path} className="relative flex items-center justify-center md:justify-end group w-full">
                      <Link to={link.path} className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-blue-300/50 hover:text-white'}`}>
                        {link.label}
                      </Link>

                      {isActive && (
                        // small animated dot indicating active link
                        <Motion.span
                          layoutId="activeDot"
                          className="absolute -left-6 hidden md:block w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-blue-200/60 gap-4 text-center md:text-left">
          <p className="font-medium">Copyright © {new Date().getFullYear()} SignBuddy. All rights reserved.</p>

          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-6 text-center md:text-right">
            <a href="https://www.instagram.com/uinsgd.official/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">UIN Sunan Gunung Djati Bandung</a>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></span>
            <a href="https://www.instagram.com/fst.uinbandung/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Fakultas Sains dan Teknologi</a>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></span>
            <a href="https://www.instagram.com/ifuinbandung/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Jurusan Teknik Informatika</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;