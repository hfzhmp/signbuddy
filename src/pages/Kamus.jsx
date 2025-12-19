import { useState, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Kamus = () => {
  const letters = useMemo(() => Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), []);
  const numbers = useMemo(() => Array.from({ length: 10 }, (_, i) => (i + 1).toString()), []);
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('huruf');
  const [selectedItem, setSelectedItem] = useState(null);

  const activeData = activeTab === 'huruf' ? letters : numbers;

  return (
    <div className="h-full flex flex-col px-2 relative">
      
      {/* HEADER */}
      <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center text-center mb-8 max-w-3xl mx-auto space-y-4">
        <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-brand-dark'}`}>Kamus Isyarat</h2>

        <div className={`backdrop-blur-md border p-4 rounded-2xl shadow-soft flex items-start gap-4 text-left group transition-colors ${isDarkMode ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800' : 'bg-white/60 border-white/50 hover:bg-white/80'}`}>
          <div className={`p-2 rounded-full transition-colors shrink-0 ${isDarkMode ? 'bg-slate-700 text-brand-main group-hover:bg-brand-main group-hover:text-white' : 'bg-brand-light text-brand-main group-hover:bg-brand-main group-hover:text-white'}`}>
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold text-sm mb-1 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>American Sign Language (ASL)</h3>
            <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              American Sign Language (ASL) adalah bahasa isyarat yang digunakan secara luas oleh komunitas Tuli di Amerika Serikat dan hampir digunakan di berbagai negara di seluruh dunia. Melalui ASL, komunitas Tuli bisa mengembangkan kemampuan bahasa, berinteraksi sosial, dan inklusi dalam lingkungan pendidikan maupun profesional.
            </p>
          </div>
        </div>
      </Motion.div>

      {/* TABS */}
      <div className="flex justify-center mb-6">
        <div className={`p-1 rounded-full flex gap-2 border shadow-sm backdrop-blur-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/50 border-brand-main/20'}`}>
          <button onClick={() => setActiveTab('huruf')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'huruf' ? 'bg-brand-main text-white shadow-glow' : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-white/50')}`}>Huruf (A-Z)</button>
          <button onClick={() => setActiveTab('angka')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'angka' ? 'bg-brand-main text-white shadow-glow' : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-white/50')}`}>Angka (1-10)</button>
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar pr-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 p-2">
          {activeData.map((item) => (
            <div 
                key={item} 
                onClick={() => setSelectedItem(item)} 
                // OPTIMASI DISINI: 
                // Hapus 'transition-all'. Ganti jadi 'transition-transform'.
                // Kita cuma animasiin SCALE pas hover. Warna background berubah INSTAN biar gak lag.
                className={`
                  aspect-square rounded-[2rem] border-[3px] shadow-sm hover:shadow-md 
                  transition-transform duration-200 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden transform hover:scale-105
                  ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-brand-main' : 'bg-white border-white hover:border-brand-main'}
                `}
            >
              <div className={`w-full h-full p-4 flex items-center justify-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-brand-light/30'}`}>
                <img 
                  src={`/assets_kamus/${item}.png`} 
                  alt={item} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-sm" 
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class='text-4xl font-bold text-gray-300'>${item}</span>`; }} 
                />
              </div>
              <div className={`absolute bottom-3 backdrop-blur-sm px-4 py-0.5 rounded-full font-bold text-lg shadow-sm border z-10 pointer-events-none ${isDarkMode ? 'bg-slate-900/80 text-white border-slate-700' : 'bg-white/80 text-brand-dark border-brand-light'}`}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POPUP */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <Motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedItem(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
            />
            
            <Motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative rounded-[2.5rem] p-2 shadow-2xl w-full max-w-sm aspect-[4/5] flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
            >
              <button onClick={() => setSelectedItem(null)} className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-black/5 hover:bg-black/10'}`}>
                  <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              </button>
              
              <div className={`flex-1 rounded-[2rem] flex items-center justify-center p-8 relative ${isDarkMode ? 'bg-slate-900/50' : 'bg-brand-light/30'}`}>
                <img src={`/assets_kamus/${selectedItem}.png`} alt={`Detail ${selectedItem}`} className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              
              <div className="h-20 flex flex-col items-center justify-center">
                <h3 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-brand-dark'}`}>{selectedItem}</h3>
                <p className={`text-xs font-medium tracking-wider uppercase mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{isNaN(selectedItem) ? 'Huruf Alfabet' : 'Nomor Angka'}</p>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kamus;