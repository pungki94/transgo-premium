import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import FleetCard from '../components/FleetCard';
import { renderIcon } from '../utils/icons';
import { resolveImage } from '../utils/assets';
import { 
    CheckCircle2, 
    PhoneCall, 
    Truck, 
    MapPin, 
    Star, 
    ArrowRight,
    Users,
    Clock,
    Headset,
    Globe
} from 'lucide-react';

export default function Services() {
    const { services, fleets, features, steps, coverageAreas } = useSelector(state => state.transport);

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            {/* 1 & 2. HERO + SERVICE CARDS (existing) */}
            <section id="services-hero" className="py-24 lg:py-32 relative z-10 border-b border-white/5">
                <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Services</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter">
                            Premium <span className="text-amber-500">Solutions</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services && services.map(s => <ServiceCard key={s.id} {...s} />)}
                    </div>
                </div>
            </section>

            {/* 3. SERVICE DETAIL (image + text) */}
            <section className="py-24 relative overflow-hidden bg-[#080B13]">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tighter mb-8">
                            Comprehensive <br/><span className="text-amber-500">Transport Ecosystem</span>
                        </h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg mb-8">
                            <p>
                                TransElite menyediakan ekosistem transportasi hulu ke hilir. Mulai dari pemenuhan kebutuhan armada pariwisata eksekutif hingga distribusi kargo logistik skala nasional kelas berat.
                            </p>
                            <p>
                                Setiap layanan dirancang dengan protokol keamanan ketat, perawatan armada terjadwal, dan dukungan kru profesional terdedikasi untuk kelancaran bisnis Anda.
                            </p>
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

            {/* 4. WHY CHOOSE US */}
            <section className="py-24 relative overflow-hidden border-y border-white/5">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="w-full lg:w-1/2 relative hidden lg:block">
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-2xl">
                            <img src={resolveImage("truck-fleet.png")} alt="Elite Fleet" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-black/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="text-amber-500 bg-amber-500/20 p-2 rounded-lg">
                                        <Star size={24} fill="currentColor" />
                                    </div>
                                    <h4 className="text-white font-bold text-xl uppercase tracking-wide">Elite Quality</h4>
                                </div>
                                <p className="text-slate-300 text-sm">Standar pelayanan premium untuk kenyamanan Anda.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Why Choose Us</span>
                        </div>
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Elite</span> Advantage
                        </h2>
                        <div className="flex flex-col gap-6 mt-10">
                            {features && features.map((feature, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-amber-500 transition-colors duration-300">
                                        <div className="text-amber-500 group-hover:text-[#0B0F19] transition-colors">{renderIcon(feature.icon)}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FLEET PREVIEW */}
            <section className="py-24 relative z-10 bg-[#080B13]">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                                <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Vehicles</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter">
                                Elite <span className="text-amber-500">Fleet</span>
                            </h2>
                        </div>
                        <Link to="/fleet" className="text-amber-500 hover:text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
                            View All Fleet <ArrowRight size={16}/>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {fleets && fleets.slice(0, 3).map(fleet => (
                            <FleetCard 
                                key={fleet.id}
                                name={fleet.name} 
                                cap={fleet.cap} 
                                type={fleet.type} 
                                img={resolveImage(fleet.img)} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. COVERAGE AREA */}
            <section className="py-24 relative overflow-hidden border-y border-white/5">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6">
                            <Globe size={40} />
                        </div>
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-6">
                            Nationwide <span className="text-amber-500">Coverage</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Jaringan logistik dan rute perjalanan kami mencakup berbagai wilayah strategis di seluruh penjuru negeri.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {coverageAreas && coverageAreas.map((area, idx) => (
                            <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-[24px] hover:bg-amber-500 hover:text-[#0B0F19] hover:border-amber-500 transition-colors group">
                                <h4 className="text-white group-hover:text-[#0B0F19] font-bold uppercase tracking-wide">{area}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. PROCESS */}
            <section className="py-24 bg-[#080B13] relative z-10">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Simple Process</span>
                    </div>
                    <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-16">
                        How It <span className="text-amber-500">Works</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                        <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0"></div>
                        {steps && steps.map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center group">
                                <div className="w-24 h-24 rounded-full bg-[#0B0F19] border-4 border-[#080B13] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_2px_rgba(245,158,11,1)] flex items-center justify-center mb-6 transition-all duration-300">
                                    <div className="text-slate-400 group-hover:text-amber-500 transition-colors">{renderIcon(item.icon, { size: 32 })}</div>
                                </div>
                                <div className="text-amber-500 font-black italic text-xl mb-2">STEP {item.step}</div>
                                <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-sm max-w-[200px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. CTA */}
            <section className="py-20 relative z-10 border-t border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080B13] to-[#0B0F19] z-0" />
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-[4rem] font-black italic uppercase text-white tracking-tighter mb-6 leading-none">
                        Ready To Experience <br/><span className="text-amber-500">Elite Transport?</span>
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