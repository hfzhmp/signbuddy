import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';

// Components
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import Preloader from './components/Preloader';

// Pages (Lazy Load)
const Home = lazy(() => import('./pages/Home'));
const Terjemah = lazy(() => import('./pages/Terjemah'));
const Kamus = lazy(() => import('./pages/Kamus'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isInitialLoading ? (
          <Motion.div 
            key="preloader" 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Preloader />
          </Motion.div>
        ) : (
          <Motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  } 
                />
                <Route 
                  path="/terjemah" 
                  element={
                    <Layout>
                      <Terjemah />
                    </Layout>
                  } 
                />
                <Route 
                  path="/kamus" 
                  element={
                    <Layout>
                      <Kamus />
                    </Layout>
                  } 
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;