import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAllData } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

// Lazy load non-critical pages — reduces initial JS bundle
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const OurFleet = lazy(() => import('./pages/OurFleet'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
    <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
  </div>
);

// Auth routes that should NOT trigger data fetching
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
  };

  // Only fetch data on public routes (not auth routes like /login)
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (isAuthRoute) return; // Skip all fetching on auth pages — instant load

    // Initial fetch
    dispatch(fetchAllData());

    // Re-fetch every 15 seconds (increased from 10s to reduce load)
    const interval = setInterval(() => {
      dispatch(fetchAllData());
    }, 15 * 1000);

    // Re-fetch when user switches back to this tab
    let visibilityTimer = null;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(visibilityTimer);
        visibilityTimer = setTimeout(() => {
          dispatch(fetchAllData());
        }, 500);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      clearTimeout(visibilityTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch, isAuthRoute]);

  return (
    <div className="bg-[#0B0F19] min-h-screen flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth Routes — No Navbar/Footer, no data fetching */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Public Routes — With Navbar & Footer */}
          <Route
            element={
              <>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <div className="flex-grow flex flex-col">
                  <Outlet />
                </div>
                <Footer />
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fleet" element={<OurFleet />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={isAuthenticated ? <Gallery /> : <Navigate to="/login" replace />} />

            {/* Dynamic Pages from Spreadsheet */}
            <Route path="/:slug" element={<DynamicPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;