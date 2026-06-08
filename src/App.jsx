import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/next';


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
      <Analytics />
      {/* Overlay Preloader (Fixed on top) */}
      {isInitialLoading && <Preloader />}

      {/* Main Content (Always Mounted underneath) */}
      <div className="relative z-0">
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
      </div>
    </Router>
  );
}

export default App;