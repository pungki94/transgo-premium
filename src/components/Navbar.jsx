import { useState, useEffect } from 'react';
import { MapPin, Phone, Bus, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';

export default function Navbar({ isAuthenticated: propAuthenticated = false, onLogout }) {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auth from Redux (fallback to prop)
    const { isAuthenticated: reduxAuthenticated } = useSelector(state => state.auth || {});
    const isAuthenticated = reduxAuthenticated !== undefined ? reduxAuthenticated : propAuthenticated;

    // Transport state from Redux
    const { settings, contact, dynamicPages } = useSelector(state => state.transport);

    // Brand settings from spreadsheet
    const brandName1 = settings?.brand_name_1 || '';
    const brandName2 = settings?.brand_name_2 || '';
    const brandIcon = settings?.brand_icon || '';
    const fixColor = (c) => (c || '').replace('##', '#');
    const brandBgColor = fixColor(settings?.brand_bg_color);
    const brandTextColor1 = fixColor(settings?.brand_text_color_1);
    const brandTextColor2 = fixColor(settings?.brand_text_color_2);
    const brandIconBg = fixColor(settings?.brand_icon_bg);
    const brandIconColor = fixColor(settings?.brand_icon_color);

    // Contact info from spreadsheet
    const phone = contact?.phone || '';
    const waNumber = phone ? phone.replace(/\D/g, '').replace(/^0/, '62') : '';
    const address = contact?.address || '';

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

    // Build nav links: core pages + any dynamic pages auto-detected from spreadsheet
    const coreLinks = [
        { name: settings?.menu_home || 'Home', path: '/' },
        { name: settings?.menu_about || 'About Us', path: '/about' },
        { name: settings?.menu_services || 'Services', path: '/services' },
        { name: settings?.menu_fleet || 'Fleet', path: '/fleet' },
        { name: settings?.menu_contact || 'Contact', path: '/contact' },
        ...(isAuthenticated ? [{ name: settings?.menu_gallery || 'Gallery', path: '/gallery' }] : [])
    ];

    // dynamicPages are auto-detected from spreadsheet metadata (any non-core sheet)
    const navLinks = [...coreLinks, ...(isAuthenticated ? (dynamicPages || []) : [])];

    // Render logo icon - use dynamic icon from settings, fallback to Bus
    const LogoIcon = () => {
        const icon = renderIcon(brandIcon, {
            size: 28,
            className: "w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7",
            fill: "currentColor"
        });
        return icon || <Bus size={28} className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="currentColor" />;
    };

    return (
        <>
            <header className="fixed w-full z-[100] h-[60px] md:h-[75px] font-sans shadow-2xl bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/5 top-0 transition-all duration-300">

                {/* Brand / Logo - Pinned to extreme left of screen */}
                <div
                    className="absolute top-0 left-0 h-full flex items-center px-4 sm:px-6 lg:px-8 z-20"
                    style={{ backgroundColor: brandBgColor }}
                >
                    <div className="flex items-center gap-1.5 lg:gap-2 font-black italic">
                        <div
                            className="p-1 lg:p-1.5 rounded-lg shrink-0"
                            style={{ backgroundColor: brandIconBg, color: brandIconColor }}
                        >
                            <LogoIcon />
                        </div>
                        <span
                            className="text-lg md:text-xl lg:text-2xl tracking-wide lowercase leading-none"
                            style={{ color: brandTextColor1 }}
                        >
                            {brandName1}
                            <span style={{ color: brandTextColor2 }}>{brandName2}</span>
                        </span>
                    </div>
                </div>

                <div className="max-w-[95rem] mx-auto w-full h-full px-4 sm:px-6 lg:px-12 flex justify-end lg:grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20 items-center">

                    {/* Placeholder to preserve grid spacing for the left side (5 columns) */}
                    <div className="hidden lg:block lg:col-span-5 h-full relative z-10 shrink-0 lg:shrink">
                    </div>

                    {/* Right Side - Nav & Info (Aligns with Hero Slider: col-span-7 + pl-8/14) */}
                    <div className="flex-grow lg:flex-grow-0 h-full flex items-center lg:col-span-7 lg:pl-8 xl:pl-14 relative">
                        {/* Navigation - Desktop */}
                        <nav className={`hidden md:flex items-center w-full h-full relative z-10 pl-4 lg:pl-8 xl:pl-12 pr-2 lg:pr-0`}>
                            <div className="flex flex-1 items-center justify-center gap-3 lg:gap-5 xl:gap-6 overflow-hidden">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`whitespace-nowrap text-[13px] lg:text-[14px] font-bold tracking-widest capitalize transition-colors relative flex flex-col justify-center h-full group ${isActive ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                                        >
                                            {link.name.toLowerCase()}
                                            <div className={`absolute top-1/2 mt-4 left-0 h-[1px] bg-amber-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                                        </Link>
                                    );
                                })}
                            </div>

                        </nav>
                    </div>

                    {/* Hamburger Button - Mobile */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:text-amber-500 transition-colors z-[101] bg-white/10 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Auth Button - Desktop (Absolute Right Edge) */}
                <div className="hidden md:flex items-center justify-end flex-shrink-0 h-full absolute right-0 top-0 z-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#0B0F19]/50 md:bg-transparent">
                    {isAuthenticated ? (
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-[13px] lg:text-[14px] font-bold tracking-widest hover:bg-red-500/25 hover:border-red-500/50 transition-all duration-200"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 bg-amber-500 text-[#0B0F19] px-4 py-2 rounded-lg text-[13px] lg:text-[14px] font-bold tracking-widest hover:bg-amber-400 transition-colors"
                        >
                            <LogIn size={14} />
                            Login
                        </Link>
                    )}
                </div>
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
                                className={`py-4 border-b border-white/5 text-sm font-bold tracking-widest capitalize transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:pl-2'}`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {link.name.toLowerCase()}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Auth Button */}
                <div className="mt-4 px-6">
                    {isAuthenticated ? (
                        <button
                            onClick={() => { onLogout(); setMobileOpen(false); }}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold tracking-widest hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-[#0B0F19] rounded-xl text-sm font-bold tracking-widest hover:bg-amber-400 transition-colors"
                        >
                            <LogIn size={16} />
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Contact Info */}
                <div className="mt-6 px-6 flex flex-col gap-4">
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors">
                        <Phone size={16} className="text-amber-500" strokeWidth={2.5} />
                        <span className="text-sm font-bold tracking-wide">{phone}</span>
                    </a>
                    <div className="flex items-center gap-3 text-slate-400">
                        <MapPin size={16} className="text-amber-500" />
                        <span className="text-sm font-bold tracking-wide">{address}</span>
                    </div>
                </div>
            </div>
        </>
    );
}