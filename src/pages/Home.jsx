import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import illustrasi from '../assets/Illustrasi.png';

import { FileText, Download, User, ArrowRight, Instagram, Webcam, HandMetal, Sparkles, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import Theme Context

const Home = () => {
  const { isDarkMode } = useTheme(); // Ambil status Dark Mode

  const teamMembers = [
    { name: "Farid Fathurrahman Hakim", role: "Lead Researcher", role1: "AI Engineer", initials: "FF", Instagram: "https://www.instagram.com/ffathurrd/" },
    { name: "Faza Adriana Putra", role: "UI/UX Designer", role1: "Researcher", initials: "FA", Instagram: "https://www.instagram.com/ptrafazaa/" },
    { name: "Firda Azzahra", role: "UI/UX Designer", role1: "Researcher", initials: "FA", Instagram: "https://www.instagram.com/frdazhraaa/" },
    { name: "Ghevrya Nur Fadilah", role: "Researcher", role1: "AI Engineer", initials: "GN", Instagram: "https://www.instagram.com/gvr_aaaaa/" },
    { name: "Hafizh Maulana Praditya", role: "Web Development", role1: "AI Engineer", initials: "HM", Instagram: "https://www.instagram.com/hfzhmp/" },
    { name: "Muhammad Zadit Taqwa Indana Zulva", role: "Researcher", role1: "Backend Dev", initials: "MZ", Instagram: "https://www.instagram.com/_z4d1ttt_/" }
  ];

  return (
    <div className="w-full pb-12">
      {/* HERO */}
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[70vh] gap-8 mb-12 relative p-4 md:p-0">

        <Motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center items-center"
        >
          <img 
            src={illustrasi}
            alt="Sign Language Illustration"
            loading="eager"
            className="w-[80%] max-w-[450px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </Motion.div>

        <Motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 space-y-4 text-center md:text-left max-w-lg mx-auto md:mx-0 flex flex-col items-center md:items-start"
        >
          <div className="flex items-center gap-4 mb-2">
            <img 
              src="/logo.png" 
              alt="SignBuddy Logo" 
              className={`w-auto h-20 md:h-25 object-contain drop-shadow-md hover:scale-105 transition-transform duration-500 ${isDarkMode ? 'brightness-0 invert' : ''}`} 
            />
          </div>
          
          <p className={`text-base md:text-lg leading-relaxed font-medium transition-colors px-4 md:px-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Penerjemah Bahasa Isyarat Dasar Berbasis Web Menggunakan 
            <span className="text-brand-dark font-semibold"> Deep Learning AI</span> dan 
            <span className="text-brand-dark font-semibold"> Deterministic Finite Automata</span>.
          </p>
          
          <Link to="/terjemah" className="w-full md:w-auto flex justify-center md:justify-start">
              <button className="mt-4 px-8 py-2.5 md:px-10 md:py-3 bg-gradient-to-r from-brand-main to-[#2dd4bf] text-white text-lg md:text-xl font-bold rounded-full shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group mx-auto md:mx-0">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
          </Link>
        </Motion.div>
      </div>

      {/* HOW IT WORKS */}
      <Motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="mt-48 mb-20 space-y-8"
      >
        <div className="text-center space-y-2 mb-10">
            <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-brand-dark'}`}>Cara Kerja SignBuddy</h2>
            <p className={`transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Terjemahkan bahasa isyarat hanya dalam 3 langkah mudah!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ITEM 1 */}
            <div className={`backdrop-blur-md p-6 rounded-[2rem] border shadow-soft hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/50'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDarkMode ? 'bg-slate-700 text-brand-main group-hover:bg-brand-main group-hover:text-white' : 'bg-brand-light text-brand-main group-hover:bg-brand-main group-hover:text-white'}`}>
                    <Webcam className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>1. Aktifkan Kamera</h3>
                <p className={`text-sm leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Izinkan akses kamera pada browser. Sistem akan otomatis mendeteksi input video secara real-time.
                </p>
            </div>

            {/* ITEM 2 */}
            <div className={`backdrop-blur-md p-6 rounded-[2rem] border shadow-soft hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/50'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDarkMode ? 'bg-slate-700 text-brand-main group-hover:bg-brand-main group-hover:text-white' : 'bg-brand-light text-brand-main group-hover:bg-brand-main group-hover:text-white'}`}>
                    <HandMetal className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>2. Peragakan Isyarat</h3>
                <p className={`text-sm leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Bentuk isyarat tangan sesuai alfabet ASL (A-Z atau 0-9). Tahan posisi stabil hingga huruf terdeteksi.
                </p>
            </div>

            {/* ITEM 3 */}
            <div className={`backdrop-blur-md p-6 rounded-[2rem] border shadow-soft hover:shadow-glow hover:-translate-y-2 transition-all duration-300 group ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/50'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDarkMode ? 'bg-slate-700 text-brand-main group-hover:bg-brand-main group-hover:text-white' : 'bg-brand-light text-brand-main group-hover:bg-brand-main group-hover:text-white'}`}>
                    <Sparkles className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>3. Validasi & Susun Kalimat</h3>
                <p className={`text-sm leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    AI menerjemahkan gerakan menjadi teks dan memvalidasi hasil sehingga menjadi kata yang benar.
                </p>
            </div>
        </div>
      </Motion.div>

      {/* ARTICLE & TEAM */}
      <Motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
      >
        
        {/* KIRI: ARTIKEL */}
        <div className={`backdrop-blur-sm p-6 rounded-[2.5rem] border shadow-soft flex flex-col h-full group transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800/80' : 'bg-white/60 border-white/50 hover:bg-white/80'}`}>
            
            {/* Header Artikel */}
            <div className="mb-4 px-2">
                <div className={`flex items-center gap-3 mb-2 ${isDarkMode ? 'text-brand-main' : 'text-brand-dark'}`}>
                    <FileText className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Tentang Penelitian</h3>
                </div>
                <h2 className={`text-1xl font-bold leading-snug transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Penerjemah Bahasa Isyarat Dasar Berbasis Web Menggunakan Deep Learning AI dan Deterministic Finite Automata
                </h2>
            </div>

            {/* PREVIEW GAMBAR */}
            <a 
                href="/article.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex-1 relative rounded-2xl border overflow-hidden shadow-inner group/img cursor-pointer min-h-[300px] ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-200 border-gray-300'}`}
            >
                {/* Browser Bar */}
                <div className={`absolute top-0 left-0 right-0 h-8 backdrop-blur-sm border-b flex items-center px-4 gap-2 z-20 ${isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-gray-100/90 border-gray-300'}`}>
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className={`ml-2 text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Artikel_TBO.pdf</span>
                </div>

                <img 
                    src="/article-thumbnail.jpg" 
                    alt="Preview Halaman 1" 
                    className="absolute inset-0 w-full h-full object-cover object-top mt-8 transition-transform duration-700 group-hover/img:scale-105"
                />

                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px] z-30 mt-8">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-2">
                        <Eye className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-bold tracking-wider">BACA SELENGKAPNYA</span>
                </div>
            </a>
            
            {/* Footer Artikel */}
            <div className="mt-6 flex justify-between items-center px-2">
                <div className={`flex flex-col text-xs font-medium italic max-w-[60%] leading-tight ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                    <span>*Pratinjau dokumen penelitian.</span>
                    <span className="mt-0.5">Unduh untuk versi lengkap.</span>
                </div>
                <a 
                    href="/article.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-bold bg-brand-dark px-5 py-2.5 rounded-full hover:bg-brand-main transition-colors shadow-lg hover:shadow-glow active:scale-95 text-sm"
                >
                    <Download className="w-4 h-4" />
                    <span>Unduh PDF</span>
                </a>
            </div>
        </div>

        {/* KANAN: TEAM BUILD */}
        <div className={`p-8 rounded-[2.5rem] shadow-glow flex flex-col relative overflow-hidden h-full ${isDarkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-brand-main text-white'}`}>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 opacity-90 mb-3">
                <User className="w-5 h-5" /> Built by Team
              </h3>
              
              <div className="ml-1 pl-4 border-l-2 border-white/30 space-y-1">
                <h4 className="font-bold text-sm tracking-wide leading-tight">
                  UIN SUNAN GUNUNG DJATI BANDUNG
                </h4>
                <p className="text-xs text-brand-light opacity-90 font-medium">
                  Fakultas Sains dan Teknologi
                </p>
                <p className="text-xs text-brand-light opacity-80">
                  Jurusan Teknik Informatika
                </p>
              </div>
            </div>

            <div className="space-y-4 custom-scrollbar-white flex-1">
              {teamMembers.map((member, idx) => (
                <a key={idx} href={member.Instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors group cursor-pointer">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform shrink-0 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-brand-main'}`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg leading-none mb-1 truncate">{member.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] text-brand-light bg-brand-dark/30 px-2 py-0.5 rounded-md">{member.role}</span>
                      <span className="text-[10px] text-brand-light bg-brand-dark/30 px-2 py-0.5 rounded-md">{member.role1}</span>
                    </div>
                  </div>
                  <div className={`shrink-0 p-2 rounded-full transition-colors shadow-sm ${isDarkMode ? 'bg-slate-700 group-hover:bg-brand-main text-white' : 'bg-white/10 group-hover:bg-white text-white group-hover:text-brand-main'}`}>
                    <Instagram className="w-5 h-5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </Motion.div>
    </div>
  );
};

export default Home;