import { useState, useEffect } from 'react';
import { MapPin, Phone, Bus, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const settings = useSelector(state => state.transport.settings);
    const contact = useSelector(state => state.transport.contact);

    // Brand settings from spreadsheet
    const brandName1 = settings?.brand_name_1 || 'TRANS';
    const brandName2 = settings?.brand_name_2 || 'ELITE';
    const brandIcon = settings?.brand_icon || 'Bus';
    const brandBgColor = settings?.brand_bg_color || '#f59e0b';       // amber-500
    const brandTextColor1 = settings?.brand_text_color_1 || '#0B0F19'; // dark
    const brandTextColor2 = settings?.brand_text_color_2 || '#ffffff'; // white
    const brandIconBg = settings?.brand_icon_bg || '#0B0F19';          // dark
    const brandIconColor = settings?.brand_icon_color || '#f59e0b';    // amber-500

    // Contact info from spreadsheet
    const phone = contact?.phone || '+62 877 8203 0286';
    const waNumber = contact?.wa_number || '6287782030286';
    const address = contact?.address || '193 Steele Street, NY';

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
        { name: settings?.menu_home || 'HOME', path: '/' },
        { name: settings?.menu_about || 'ABOUT US', path: '/about' },
        { name: settings?.menu_services || 'SERVICES', path: '/services' },
        { name: settings?.menu_fleet || 'FLEET', path: '/fleet' },
        { name: settings?.menu_contact || 'CONTACT', path: '/contact' }
    ];

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
            <header className="fixed w-full z-[100] h-[60px] md:h-[75px] flex font-sans shadow-2xl">
                {/* Left Side - Brand */}
                <div
                    className="shrink-0 h-full flex items-center px-3 md:px-4 lg:px-6"
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
                            className="text-lg md:text-xl lg:text-2xl tracking-wide uppercase leading-none"
                            style={{ color: brandTextColor1 }}
                        >
                            {brandName1}
                            <span style={{ color: brandTextColor2 }}>{brandName2}</span>
                        </span>
                    </div>
                </div>

                {/* Right Side - Nav & Info */}
                <div className="bg-[#0B0F19]/95 backdrop-blur-md flex-grow h-full flex items-center px-4 md:px-6 lg:px-12 relative border-b border-white/5">
                    {/* Decorative box lines in the background (matching footer style) */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[10%] right-[5%] w-[40%] h-[80%] border border-white/5 rounded-sm"></div>
                        <div className="absolute top-[20%] right-[8%] w-[30%] h-[60%] border border-white/[0.03]"></div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center justify-end gap-6 lg:gap-10 w-full h-full pr-[19%] lg:pr-[21%]">
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
                </div>

                {/* Hamburger Button - Mobile */}
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