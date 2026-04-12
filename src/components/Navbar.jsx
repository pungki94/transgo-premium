import { useState, useEffect } from 'react';
import { MapPin, Phone, Bus, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'SERVICES', path: '/services' },
        { name: 'FLEET', path: '/fleet' },
        { name: 'CONTACT', path: '/contact' }
    ];

    return (
        <>
            <header className="fixed w-full z-[100] h-[60px] md:h-[75px] flex font-sans shadow-2xl">
                {/* Left Side - Brand */}
                <div className="bg-amber-500 w-[180px] md:w-[240px] lg:w-[320px] shrink-0 h-full flex flex-col justify-center items-center lg:items-end lg:pr-12">
                    <div className="flex items-center gap-2 lg:gap-3 text-center lg:text-left font-black italic">
                        <div className="bg-[#0B0F19] p-1.5 lg:p-2 rounded-xl text-amber-500 shrink-0">
                            <Bus size={28} className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="currentColor" />
                        </div>
                        <span className="text-[#0B0F19] text-xl md:text-2xl lg:text-[28px] tracking-widest uppercase leading-none">
                            TRANS<span className="text-white">ELITE</span>
                        </span>
                    </div>
                </div>

                {/* Right Side - Nav & Info */}
                <div className="bg-[#0B0F19]/95 backdrop-blur-md flex-grow h-full flex justify-between items-center px-4 md:px-6 lg:px-12 relative border-b border-white/5">
                    {/* Decorative circle line in the background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-48 h-48 rounded-full border border-white/5 -translate-x-1/2"></div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-7 lg:gap-10 h-full">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-[12px] font-bold tracking-widest uppercase transition-colors relative flex flex-col justify-center h-full group ${isActive ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                                >
                                    {link.name}
                                    <div className={`absolute top-1/2 mt-4 left-0 h-[1px] bg-amber-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Contact Info */}
                    <div className="hidden xl:flex items-center gap-10 ml-auto z-10">
                        <a href="https://wa.me/6287788332767" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-amber-500 transition-colors">
                            <Phone size={16} className="text-amber-500" strokeWidth={2.5} />
                            <span className="text-[14px] font-black italic tracking-wide">+6287788332767</span>
                        </a>
                        <div className="flex items-center gap-3 text-white">
                            <MapPin size={16} className="text-white" />
                            <span className="text-[14px] font-bold tracking-wide">193 Steele Street, NY</span>
                        </div>
                    </div>
                </div>

                {/* Hamburger Button - Mobile (positioned absolutely in header, outside any container) */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:text-amber-500 transition-colors z-[101] bg-white/10 rounded-lg"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-[60px] right-0 bottom-0 w-[280px] bg-[#0B0F19] border-l border-white/10 z-[99] md:hidden transform transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <nav className="flex flex-col pt-6 px-6">
                    {navLinks.map((link, i) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={`py-4 border-b border-white/5 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:pl-2'}`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Contact Info */}
                <div className="mt-8 px-6 flex flex-col gap-4">
                    <a href="https://wa.me/6287788332767" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors">
                        <Phone size={16} className="text-amber-500" strokeWidth={2.5} />
                        <span className="text-sm font-bold tracking-wide">+62 877 8833 2767</span>
                    </a>
                    <div className="flex items-center gap-3 text-slate-400">
                        <MapPin size={16} className="text-amber-500" />
                        <span className="text-sm font-bold tracking-wide">193 Steele Street, NY</span>
                    </div>
                </div>
            </div>
        </>
    );
}