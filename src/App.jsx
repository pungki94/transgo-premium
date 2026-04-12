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
    dispatch(fetchAllData());
  }, [dispatch]);

  return (
    <div className="bg-[#0B0F19] min-h-screen flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <Navbar />
      <ScrollToTop />
      <div className="flex-grow">
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