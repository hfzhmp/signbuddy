import { motion as Motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <Motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl"
    >
      <div className="relative flex items-center justify-center">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-brand-light border-t-brand-main opacity-50 absolute"
        />
        <Motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-brand-dark absolute"
        />
        <div className="z-10 bg-white p-2 rounded-full shadow-sm">
          <Loader2 className="w-8 h-8 text-brand-main animate-spin" />
        </div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
          SignBuddy
        </h2>
        <p className="text-brand-text/60 text-sm font-medium animate-pulse">
          Memuat Website...
        </p>
      </Motion.div>
    </Motion.div>
  );
};

export default LoadingScreen;