import { motion as Motion } from 'framer-motion';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#E0F2FE] flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        
        <Motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 0.8 
          }}
          className="mb-4"
        >
          <img src="/logo.png" alt="Loading..." className="h-24 w-auto object-contain drop-shadow-xl" />
        </Motion.div>

        <div className="w-48 h-1.5 bg-brand-main/20 rounded-full overflow-hidden relative">
          <Motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-brand-main rounded-full"
          />
        </div>

        <p className="mt-4 text-brand-main/60 text-xs font-bold tracking-[0.2em] animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  );
};

export default Preloader;