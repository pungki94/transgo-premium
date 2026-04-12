import { MapPin, Phone, Bus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'SERVICES', path: '/services' },
        { name: 'FLEET', path: '/fleet' },
        { name: 'CONTACT', path: '/contact' }
    ];

    return (
        <header className="fixed w-full z-[100] h-[75px] flex font-sans shadow-2xl">
            {/* Left Side - Brand */}
            <div className="bg-amber-500 w-[240px] md:w-[320px] shrink-0 h-full flex flex-col justify-center items-center lg:items-end lg:pr-12">
                <div className="flex items-center gap-2 lg:gap-3 text-center lg:text-left font-black italic">
                    <div className="bg-[#0B0F19] p-1.5 lg:p-2 rounded-xl text-amber-500 shrink-0">
                        <Bus size={28} className="w-6 h-6 lg:w-7 lg:h-7" fill="currentColor" />
                    </div>
                    <span className="text-[#0B0F19] text-2xl lg:text-[28px] tracking-widest uppercase leading-none">
                        TRANS<span className="text-white">ELITE</span>
                    </span>
                </div>
            </div>

            {/* Right Side - Nav & Info */}
            <div className="bg-[#0B0F19]/95 backdrop-blur-md flex-grow h-full flex justify-between items-center px-6 lg:px-12 relative overflow-hidden border-b border-white/5">
                {/* Decorative circle line in the background (like the screenshot) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-48 h-48 rounded-full border border-white/5 -translate-x-1/2 pointer-events-none"></div>

                {/* Navigation */}
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
        </header>
    );
}