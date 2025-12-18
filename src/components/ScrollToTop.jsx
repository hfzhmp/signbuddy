import { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop({ containerId }) {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // reset scroll position of the specified container on navigation
  useLayoutEffect(() => {
    const container = document.getElementById(containerId);
    if (container) container.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, containerId]);

  // toggle floating button visibility based on container scroll
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const toggleVisibility = () => setIsVisible(container.scrollTop > 300);
    container.addEventListener("scroll", toggleVisibility);
    return () => container.removeEventListener("scroll", toggleVisibility);
  }, [containerId]);

  const handleScrollUp = () => {
    const container = document.getElementById(containerId);
    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollUp}
          className="fixed bottom-8 right-8 z-[90] p-3.5 bg-gradient-to-r from-brand-main to-cyan-400 text-white rounded-full shadow-lg transition-all group"
          title="Kembali ke atas"
        >
          <ArrowUp className="w-6 h-6 stroke-[3px] group-hover:-translate-y-1 transition-transform duration-300" />
        </Motion.button>
      )}
    </AnimatePresence>
  );
}