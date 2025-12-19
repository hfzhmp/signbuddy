import { Loader2 } from "lucide-react";

// CSS-based Loading Screen to prevent Framer Motion + Suspense conflicts
const LoadingScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative flex items-center justify-center">
        {/* Ring 1 - Slow Spin */}
        <div
          className="w-24 h-24 rounded-full border-4 border-brand-light border-t-brand-main opacity-50 absolute animate-[spin_3s_linear_infinite]"
        />
        {/* Ring 2 - Fast Spin Reverse */}
        <div
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-brand-dark absolute animate-[spin_1.5s_linear_infinite_reverse]" 
        />
        <div className="z-10 bg-white p-2 rounded-full shadow-sm">
          <Loader2 className="w-8 h-8 text-brand-main animate-spin" />
        </div>
      </div>

      <div
        className="mt-8 text-center space-y-2 animate-fade-in-up"
      >
        <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
          SignBuddy
        </h2>
        <p className="text-brand-text/60 text-sm font-medium animate-pulse">
          Memuat Website...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;