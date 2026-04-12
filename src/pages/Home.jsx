import Hero from '../components/Hero';
import FleetCard from '../components/FleetCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resolveImage } from '../utils/assets';
import { ArrowRight } from 'lucide-react';

import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import StepsSection from '../components/StepsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { stats } from '../data/stats';

export default function Home() {
    const { fleets } = useSelector(state => state.transport);

    return (
        <div id="home" className="bg-[#0B0F19] min-h-screen font-sans overflow-hidden">
            <Hero />
            
            <ServicesSection />
            <FeaturesSection variant="home" />

            {/* 3. FLEET SHOWCASE */}
            <section className="py-24 relative z-10">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                                <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Vehicles</span>
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">
                                Elite <span className="text-amber-500">Fleet</span>
                            </h2>
                        </div>
                        <div className="hidden lg:flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="flex flex-col px-4 border-r border-white/10">
                                <span className="text-amber-500 font-bold text-xl">{stats.fleetUnits}</span>
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Bus Units</span>
                            </div>
                            <div className="flex flex-col px-4 border-r border-white/10">
                                <span className="text-amber-500 font-bold text-xl">100+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Truck Units</span>
                            </div>
                            <div className="flex flex-col px-4">
                                <span className="text-amber-500 font-bold text-xl">{stats.onTime}</span>
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Nationwide</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {fleets && fleets.slice(0, 3).map(fleet => (
                            <FleetCard 
                                key={fleet.id}
                                name={fleet.name} 
                                cap={fleet.cap} 
                                type={fleet.type} 
                                img={fleet.name?.toLowerCase() === 'mini bus' ? resolveImage('mini-bus.png') : resolveImage(fleet.img)} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            <StepsSection />
            <StatsSection />
            <TestimonialsSection />

            {/* 7. CTA */}
            <section className="py-20 relative z-10 border-t border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080B13] to-[#0B0F19] z-0" />
                
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-[4rem] font-black italic uppercase text-white tracking-tighter mb-6 leading-none">
                        Ready To Experience <br/>
                        <span className="text-amber-500">Elite Transport?</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Jangan biarkan masalah logistik dan transportasi menghambat bisnis Anda. Hubungi tim kami sekarang untuk mendapatkan penawaran terbaik.
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-3 bg-amber-500 text-[#0B0F19] px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300">
                        Contact Us Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
}