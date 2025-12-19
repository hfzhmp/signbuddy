const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#E0F2FE] flex items-center justify-center animate-fade-in">
      <div className="relative flex flex-col items-center">
        
        <div
          className="mb-4 animate-pulse"
        >
          <img src="/logo.png" alt="Loading..." className="h-24 w-auto object-contain drop-shadow-xl" />
        </div>

        <div className="w-48 h-1.5 bg-brand-main/20 rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-brand-main rounded-full animate-[shimmer_1.5s_infinite]"
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