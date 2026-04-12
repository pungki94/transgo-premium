import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImage } from '../utils/assets';
import { CheckCircle2, ArrowRight } from 'lucide-react';

import ServicesSection from '../components/ServicesSection';
import CoverageAreaSection from '../components/CoverageAreaSection';

export default function Services() {
    
    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            <ServicesSection isHero={true} />

            <section className="py-24 relative overflow-hidden bg-[#080B13]">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tighter mb-8">
                            Comprehensive <br/>
                            <span className="text-amber-500">Transport Ecosystem</span>
                        </h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg mb-8">
                            <p>TransElite menyediakan ekosistem transportasi hulu ke hilir.</p>
                            <p>Setiap layanan dirancang dengan protokol keamanan ketat dan dukungan kru profesional.</p>
                        </div>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20}/> Terintegrasi penuh dengan ekosistem IT logistik</li>
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20}/> Perlindungan asuransi pengiriman komprehensif</li>
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20}/> Skalabilitas tinggi untuk proyek tender korporasi</li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={resolveImage("bus-fleet.jpg")} className="w-full h-full object-cover" alt="Service Detail" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            <CoverageAreaSection />


            <section className="py-20 relative z-10 border-t border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080B13] to-[#0B0F19] z-0" />
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-[4rem] font-black italic uppercase text-white tracking-tighter mb-6 leading-none">
                        Ready To Experience <br/>
                        <span className="text-amber-500">Elite Transport?</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Hubungi tim kami sekarang untuk mendapatkan penawaran terbaik.
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-3 bg-amber-500 text-[#0B0F19] px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300">
                        Contact Us Now <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
}