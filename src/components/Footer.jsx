import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone, Send, Bus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';

export default function Footer() {
    const settings = useSelector(state => state.transport.settings);
    const contact = useSelector(state => state.transport.contact);

    // Brand settings from spreadsheet (same as Navbar)
    const brandName1 = settings?.brand_name_1 || 'TRANS';
    const brandName2 = settings?.brand_name_2 || 'ELITE';
    const brandIcon = settings?.brand_icon || 'Bus';
    const brandBgColor = settings?.brand_bg_color || '#f59e0b';
    const brandTextColor1 = settings?.brand_text_color_1 || '#0B0F19';
    const brandTextColor2 = settings?.brand_text_color_2 || '#ffffff';
    const brandIconBg = settings?.brand_icon_bg || '#0B0F19';
    const brandIconColor = settings?.brand_icon_color || '#f59e0b';

    // Contact info from spreadsheet
    const address = contact?.address || '193 Steele Street, New York, NY 10001';
    const email = contact?.email || 'info@transelite.com';
    const phone = contact?.phone || '+62 877 8203 0286';
    const waNumber = contact?.wa_number || '6287782030286';
    const footerDesc = contact?.footer_desc || 'Providing top-tier transport and logistics solutions. Your reliable partner in moving your business forward with confidence.';
    const copyright = contact?.copyright || 'Made With ❤️© 2025 PT Integrasi Performa Amanah (Grasfam). All Rights Reserved.';

    // Social media links from spreadsheet
    const fbLink = contact?.facebook || '#';
    const igLink = contact?.instagram || '#';
    const twLink = contact?.twitter || '#';
    const liLink = contact?.linkedin || '#';

    // Footer labels from spreadsheet
    const quickLinksTitle = contact?.quick_links_title || 'Quick Links';
    const contactUsTitle = contact?.contact_us_title || 'Contact Us';
    const newsletterTitle = contact?.newsletter_title || 'Subscribe Newsletter';
    const newsletterDesc = contact?.newsletter_desc || 'Stay updated with our latest news and special offers. We promise not to spam your inbox.';
    const emailPlaceholder = contact?.email_placeholder || 'Enter your email';
    const menuHome = settings?.menu_home || 'Home';
    const menuAbout = settings?.menu_about || 'About Us';
    const menuServices = settings?.menu_services || 'Services';
    const menuFleet = settings?.menu_fleet || 'Our Fleet';
    const menuContact = settings?.menu_contact || 'Contact';

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
                            <span className="text-lg md:text-xl lg:text-2xl tracking-wide uppercase leading-none" style={{ color: brandTextColor1 }}>
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
                                <li><Link to="/" className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300">{menuHome}</Link></li>
                                <li><Link to="/about" className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300">{menuAbout}</Link></li>
                                <li><Link to="/services" className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300">{menuServices}</Link></li>
                                <li><Link to="/fleet" className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300">{menuFleet}</Link></li>
                                <li><Link to="/contact" className="hover:text-amber-500 hover:translate-x-1 inline-block transition-all duration-300">{menuContact}</Link></li>
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