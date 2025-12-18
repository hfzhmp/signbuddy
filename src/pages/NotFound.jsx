import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="relative w-full h-screen bg-[#E0F2FE] overflow-hidden flex flex-col items-center justify-center text-center px-6">
      
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-main/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <Motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-[3rem] shadow-soft max-w-lg w-full"
      >
        <div className="mb-6 flex justify-center">
          <h1 className="text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-main to-cyan-400 leading-none select-none">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-brand-dark mb-3">
          Wah, nyasar nih?
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Halaman yang kamu cari sepertinya sudah pindah dimensi atau memang tidak pernah ada. Yuk, balik ke tempat aman!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-8 py-3 bg-brand-main text-white rounded-full font-bold shadow-glow hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-gray-500 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </Motion.div>

      <div className="absolute bottom-8 text-brand-main/30 font-bold tracking-widest text-xs uppercase">
        SignBuddy Error Page
      </div>
    </div>
  );
};

export default NotFound;