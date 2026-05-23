import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAllData } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import OurFleet from './pages/OurFleet';
import Contact from './pages/Contact';
import WhatsAppFAB from './components/WhatsAppFAB';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial fetch
    dispatch(fetchAllData());

    // Re-fetch every 15 seconds so spreadsheet edits appear quickly
    const interval = setInterval(() => {
      dispatch(fetchAllData());
    }, 2 * 1000);

    // Re-fetch when user switches back to this tab (e.g. after editing spreadsheet)
    // Debounced to avoid excessive calls on rapid tab switches
    let visibilityTimer = null;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(visibilityTimer);
        visibilityTimer = setTimeout(() => {
          dispatch(fetchAllData());
        }, 500); // 2s debounce — wait for tab to settle
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      clearTimeout(visibilityTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch]);

  return (
    <div className="bg-[#0B0F19] min-h-screen flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <Navbar />
      <ScrollToTop />
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fleet" element={<OurFleet />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <WhatsAppFAB />
      <Footer />
    </div>
  );
}

export default App;