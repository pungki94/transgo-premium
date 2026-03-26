import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FleetCard from '../components/FleetCard';
import { renderIcon } from '../utils/icons';
import { resolveImage } from '../utils/assets';
import { 
    CheckCircle2, 
    TrendingUp, 
    Users, 
    Truck, 
    MapPin, 
    Clock, 
    Headset,
    Star,
    Target,
    Eye,
    Shield,
    HeartHandshake,
    ArrowRight
} from 'lucide-react';

export default function About() {
    const { fleets, features, stats } = useSelector(state => state.transport);
    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            {/* 1. HERO ABOUT */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/5 bg-[#080B13]">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">About Us</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter mb-6">
                        DRIVING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">FUTURE</span><br/> OF LOGISTICS
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        TransElite adalah penyedia layanan transportasi dan logistik premium yang berdedikasi untuk memberikan solusi pengiriman dan perjalanan yang aman, efisien, dan modern.
                    </p>
                </div>
            </section>

            {/* 2. COMPANY OVERVIEW */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-square lg:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={resolveImage("bus-fleet.jpg")} className="w-full h-full object-cover" alt="Company Overview" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 p-4 bg-amber-500 rounded-2xl">
                                <span className="text-[#0B0F19] font-black text-2xl italic leading-none block px-2">10+ YEARS</span>
                                <span className="text-[#0B0F19] tracking-widest font-bold text-xs uppercase block px-2 mt-1">Experience</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tighter mb-8">
                            A Legacy of <span className="text-amber-500">Excellence</span>
                        </h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg">
                            <p>
                                Berdiri sejak lebih dari satu dekade lalu, TransElite bertransformasi dari penyedia armada lokal menjadi perusahaan penyedia solusi logistik dan transportasi nasional berskala premium.
                            </p>
                            <p>
                                Kami memahami bahwa di dunia logistik modern, efisiensi dan keandalan adalah kunci utama. Oleh karena itu, kami terus berinvestasi pada armada-armada terbaru serta sistem pelacakan (real-time tracking) berbasis cloud untuk memastikan setiap perjalanan sesuai dengan standar kualitas eksekutif.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. VISION & MISSION */}
            <section className="py-24 bg-[#080B13] border-y border-white/5 relative">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                            <Eye size={120} />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tight mb-4 relative z-10">Our Vision</h3>
                        <p className="text-slate-400 text-lg leading-relaxed relative z-10">
                            Menjadi penyedia layanan transportasi dan logistik premium nomor satu di Indonesia yang dikenal karena keandalan, inovasi teknologi, dan standar pelayanan pelanggan tanpa kompromi.
                        </p>
                    </div>
                    <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                            <Target size={120} />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10">
                            <Target size={32} />
                        </div>
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tight mb-4 relative z-10">Our Mission</h3>
                        <ul className="text-slate-400 text-lg leading-relaxed flex flex-col gap-3 relative z-10">
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Menyediakan armada transportasi darat modern berstandar premium.</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Menerapkan keunggulan operasional 24/7.</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Membangun kemitraan strategis dengan entitas korporat nasional.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. WHY CHOOSE US */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Why Choose Us</span>
                        </div>
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Elite</span> Advantage
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Kami menghadirkan pengalaman logistik dan travel terbaik dengan standar pelayanan yang memprioritaskan privasi, kenyamanan, serta tingkat keamanan tertinggi.
                        </p>

                        <div className="flex flex-col gap-6">
                            {features && features.map((feature, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-amber-500 transition-colors duration-300">
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
                    
                    <div className="w-full lg:w-1/2 relative hidden lg:block">
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-[0_0_60px_rgba(245,158,11,0.15)]">
                            <img src={resolveImage("truck-fleet.png")} alt="Elite Trucking" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. STATISTICS */}
            <section className="py-20 bg-amber-500 relative z-10">
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

            {/* 6. FLEET SHOWCASE */}
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
                        <div className="hidden lg:flex flex-wrap items-center gap-4 lg:gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="flex flex-col px-4 border-r border-white/10">
                                <span className="text-amber-500 font-bold text-xl">50+</span>
                                <span className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-bold">Bus Units</span>
                            </div>
                            <div className="flex flex-col px-4 border-r border-white/10">
                                <span className="text-amber-500 font-bold text-xl">100+</span>
                                <span className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-bold">Truck Units</span>
                            </div>
                            <div className="flex flex-col px-4">
                                <span className="text-amber-500 font-bold text-xl">100%</span>
                                <span className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-bold">Nationwide</span>
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

            {/* 7. CORE VALUES */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">
                            Our Core <span className="text-amber-500">Values</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                                <Shield size={32} />
                            </div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Integrity</h4>
                            <p className="text-slate-400 text-sm">Menjalankan operasional dengan standar integritas dan keamanan tertinggi di industri.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                                <HeartHandshake size={32} />
                            </div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Reliability</h4>
                            <p className="text-slate-400 text-sm">Akurat dan dapat diandalkan adalah janji utama yang selalu kami penuhi bagi setiap klien.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                                <TrendingUp size={32} />
                            </div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Excellence</h4>
                            <p className="text-slate-400 text-sm">Berkomitmen pada inovasi berkelanjutan untuk selalu berada di garis depan layanan logistik.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA */}
            <section className="py-20 relative z-10 border-t border-white/10 bg-[#080B13]">
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-[4rem] font-black italic uppercase text-white tracking-tighter mb-6 leading-none">
                        Partner With <br/>
                        <span className="text-amber-500">TransElite Today</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Tingkatkan efisiensi bisnis Anda dengan dukungan sistem logistik dan transportasi terbaik. Mari buat perubahan besar bersama.
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
