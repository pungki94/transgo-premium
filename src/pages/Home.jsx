import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import FleetCard from '../components/FleetCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';
import { resolveImage } from '../utils/assets';
import { 
    CheckCircle2, 
    PhoneCall, 
    Truck, 
    MapPin, 
    Star, 
    ArrowRight,
    TrendingUp,
    Users,
    ShieldCheck,
    Clock,
    Headset
} from 'lucide-react';

export default function Home() {
    const { services, fleets, features, testimonials, stats, steps } = useSelector(state => state.transport);

    return (
        <div id="home" className="bg-[#0B0F19] min-h-screen font-sans overflow-hidden">
            <Hero />

            {/* 1. SERVICES */}
            <section className="py-24 relative z-10">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Services</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">
                            Premium <span className="text-amber-500">Solutions</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services && services.map(s => (
                            <ServiceCard 
                                key={s.id}
                                title={s.title} 
                                desc={s.desc} 
                                icon={s.icon} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. WHY CHOOSE US */}
            <section className="py-24 bg-[#080B13] relative overflow-hidden border-y border-white/5">
                {/* Ambient glow */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-2xl">
                            <img src={resolveImage("bus-fleet.jpg")} alt="Elite Fleet" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080B13] via-black/20 to-transparent" />
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
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Kami menghadirkan pengalaman transportasi dan logistik terbaik dengan standar pelayanan kelas satu yang memprioritaskan keamanan dan ketepatan waktu.
                        </p>

                        <div className="flex flex-col gap-6">
                            {features && features.map((feature, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors duration-300">
                                        <div className="text-amber-500 group-hover:text-[#0B0F19] transition-colors">{renderIcon(feature.icon)}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1 tracking-wide">{feature.title}</h4>
                                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

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
                                <span className="text-amber-500 font-bold text-xl">{stats?.fleetUnits || '50+'}</span>
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Bus Units</span>
                            </div>
                            <div className="flex flex-col px-4 border-r border-white/10">
                                <span className="text-amber-500 font-bold text-xl">100+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Truck Units</span>
                            </div>
                            <div className="flex flex-col px-4">
                                <span className="text-amber-500 font-bold text-xl">{stats?.onTime || '100%'}</span>
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
                                img={resolveImage(fleet.img)} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 bg-[#080B13] border-y border-white/5 relative z-10">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Simple Process</span>
                    </div>
                    <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-16">
                        How It <span className="text-amber-500">Works</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0"></div>

                        {steps && steps.map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center group">
                                <div className="w-24 h-24 rounded-full bg-[#0B0F19] border-4 border-[#080B13] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_2px_rgba(245,158,11,1)] flex items-center justify-center mb-6 transition-all duration-300 group-hover:-translate-y-2">
                                    <div className="text-slate-400 group-hover:text-amber-500 transition-colors">
                                        {renderIcon(item.icon, { size: 32 })}
                                    </div>
                                </div>
                                <div className="text-amber-500 font-black italic text-xl mb-2">STEP {item.step}</div>
                                <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-sm max-w-[200px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. STATISTICS */}
            <section className="py-20 bg-amber-500 relative z-10">
                {/* Subtle pattern or texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 text-center divide-x-0 lg:divide-x lg:divide-black/10">
                        <div className="flex flex-col items-center">
                            <TrendingUp size={40} className="text-[#0B0F19] mb-4 opacity-50" />
                            <h3 className="text-5xl lg:text-6xl font-black text-[#0B0F19] tracking-tighter mb-2">{stats?.trips || '0'}</h3>
                            <p className="text-[#0B0F19] font-bold uppercase tracking-widest text-sm">Trips Completed</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Users size={40} className="text-[#0B0F19] mb-4 opacity-50" />
                            <h3 className="text-5xl lg:text-6xl font-black text-[#0B0F19] tracking-tighter mb-2">{stats?.clients || '0'}</h3>
                            <p className="text-[#0B0F19] font-bold uppercase tracking-widest text-sm">Corporate Clients</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle2 size={40} className="text-[#0B0F19] mb-4 opacity-50" />
                            <h3 className="text-5xl lg:text-6xl font-black text-[#0B0F19] tracking-tighter mb-2">{stats?.onTime || '0%'}</h3>
                            <p className="text-[#0B0F19] font-bold uppercase tracking-widest text-sm">On-Time Delivery</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Truck size={40} className="text-[#0B0F19] mb-4 opacity-50" />
                            <h3 className="text-5xl lg:text-6xl font-black text-[#0B0F19] tracking-tighter mb-2">{stats?.fleetUnits || '0'}</h3>
                            <p className="text-[#0B0F19] font-bold uppercase tracking-widest text-sm">Fleet Units</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIAL */}
            <section className="py-24 relative z-10">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Testimonials</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">
                            Client <span className="text-amber-500">Stories</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials && testimonials.map((t, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[40px] hover:border-amber-500/30 transition-colors">
                                <div className="flex gap-1 text-amber-500 mb-6">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">"{t.review}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[#0B0F19] font-bold text-lg">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold">{t.name}</h5>
                                        <p className="text-slate-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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