import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone, Send, Bus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';

export default function Footer() {
    const { settings, menu, contact, dynamicPages } = useSelector(state => state.transport);
    const { isAuthenticated } = useSelector(state => state.auth || {});

    // Brand settings from spreadsheet (same as Navbar)
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
    const address = contact?.address || '';
    const email = contact?.email || '';
    const phone = contact?.phone || '';
    const waNumber = phone ? phone.replace(/\D/g, '').replace(/^0/, '62') : '';
    const footerDesc = contact?.footer_desc || '';
    const copyright = contact?.copyright || '';

    // Social media links
    const fbLink = contact?.facebook || '';
    const igLink = contact?.instagram || '';
    const twLink = contact?.twitter || '';
    const liLink = contact?.linkedin || '';

    // Footer labels from spreadsheet
    const quickLinksTitle = contact?.quick_links_title || '';
    const contactUsTitle = contact?.contact_us_title || '';
    const newsletterTitle = contact?.newsletter_title || '';
    const newsletterDesc = contact?.newsletter_desc || '';
    const emailPlaceholder = contact?.email_placeholder || '';

    // Dynamically build nav links from Menu sheet, fallback to default if empty
    // Automatically include any sheets detected as dynamic pages
    const baseLinks = menu && menu.length > 0
        ? menu
        : [
            { name: settings?.menu_home || 'HOME', path: '/' },
            { name: settings?.menu_about || 'ABOUT US', path: '/about' },
            { name: settings?.menu_services || 'SERVICES', path: '/services' },
            { name: settings?.menu_fleet || 'FLEET', path: '/fleet' },
            { name: settings?.menu_contact || 'CONTACT', path: '/contact' },
            { name: settings?.menu_gallery || 'GALLERY', path: '/gallery' }
        ];

    const navLinks = [...baseLinks, ...(isAuthenticated ? (dynamicPages || []) : [])];

    // Render logo icon dynamically
    const LogoIcon = () => {
        const icon = renderIcon(brandIcon, {
            size: 28,
            fill: "currentColor"
        });
        return icon || <Bus size={28} fill="currentColor" />;
    };

    return (
        <footer className="bg-[#0B0F19] pt-12 md:pt-20 pb-8 text-white font-sans border-t border-white/5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-12 lg:gap-8 xl:gap-16">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col items-start pr-0 lg:pr-8 text-left">
                        <div className="flex items-center gap-1.5 lg:gap-2 font-black italic mb-6 px-3 py-2 rounded-lg" style={{ backgroundColor: brandBgColor }}>
                            <div className="p-1 lg:p-1.5 rounded-lg shrink-0" style={{ backgroundColor: brandIconBg, color: brandIconColor }}>
                                <LogoIcon />
                            </div>
                            <span className="text-lg md:text-xl lg:text-2xl tracking-wide capitalize leading-none" style={{ color: brandTextColor1 }}>
                                {brandName1}<span style={{ color: brandTextColor2 }}>{brandName2}</span>
                            </span>
                        </div>

                        <p className="text-slate-400 text-[13px] leading-relaxed mb-8 max-w-sm">
                            {footerDesc}
                        </p>

                        <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                            <a href={fbLink} aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 flex items-center justify-center text-slate-300 hover:text-[#0B0F19] transition-all duration-300">
                                <Facebook size={16} fill="currentColor" strokeWidth={0} />
                            </a>
                            <a href={igLink} aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 flex items-center justify-center text-slate-300 hover:text-[#0B0F19] transition-all duration-300">
                                <Instagram size={14} strokeWidth={2.5} />
                            </a>
                            <a href={twLink} aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 flex items-center justify-center text-slate-300 hover:text-[#0B0F19] transition-all duration-300">
                                <Twitter size={14} fill="currentColor" strokeWidth={0} />
                            </a>
                            <a href={liLink} aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 flex items-center justify-center text-slate-300 hover:text-[#0B0F19] transition-all duration-300">
                                <Linkedin size={14} fill="currentColor" strokeWidth={0} />
                            </a>
                        </div>
                    </div>

                    {/* Columns Wrapper - Right Side */}
                    <div className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-10">
                        {/* Quick Link */}
                        <div className="flex flex-col lg:col-span-2">
                            <h4 className="font-bold text-white tracking-wide text-[15px] mb-6">{quickLinksTitle}</h4>
                            <ul className="flex flex-col gap-3.5 text-[13px] text-slate-400">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300 capitalize">
                                            {link.name.toLowerCase()}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="flex flex-col lg:col-span-2 lg:pl-4 xl:pl-0">
                            <h4 className="font-bold text-white tracking-wide text-[15px] mb-6 whitespace-nowrap">{contactUsTitle}</h4>
                            <ul className="flex flex-col gap-5 text-[13px] text-slate-400">
                                <li className="flex items-center gap-4 group cursor-default">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 transition-colors duration-300">
                                        <MapPin size={14} className="text-amber-500 group-hover:text-[#0B0F19] transition-colors duration-300" />
                                    </div>
                                    <span className="leading-relaxed">{address}</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 transition-colors duration-300">
                                        <Mail size={14} className="text-amber-500 group-hover:text-[#0B0F19] transition-colors duration-300" />
                                    </div>
                                    <a href={`mailto:${email}`} className="hover:text-amber-500 transition-colors">{email}</a>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 transition-colors duration-300">
                                        <Phone size={14} className="text-amber-500 group-hover:text-[#0B0F19] transition-colors duration-300" />
                                    </div>
                                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">{phone}</a>
                                </li>
                            </ul>
                        </div>

                        {/* Subscribe To Our Newsletter */}
                        <div className="flex flex-col lg:col-span-3 lg:pl-4 xl:pl-6">
                            <h4 className="font-bold text-white tracking-wide text-[15px] mb-6 whitespace-nowrap">{newsletterTitle}</h4>
                            <p className="text-[13px] text-slate-400 leading-relaxed mb-6">
                                {newsletterDesc}
                            </p>
                            <form className="relative flex items-center w-full max-w-sm">
                                <input
                                    type="email"
                                    placeholder={emailPlaceholder}
                                    className="w-full bg-white/5 text-white placeholder:text-slate-500 text-[13px] px-5 py-3.5 pr-14 rounded-full outline-none border border-white/10 focus:border-amber-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="absolute right-1 w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-[#0B0F19] transition-all duration-300 border border-transparent hover:border-amber-500"
                                >
                                    <Send size={14} className="-ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center text-[12px] text-slate-500 pt-6 md:pt-8 mt-10 md:mt-14 mb-2 border-t border-white/5 gap-4 md:gap-0 font-medium tracking-wide">
                    <p>
                        {copyright}
                    </p>
                </div>

            </div>
        </footer>
    );
}