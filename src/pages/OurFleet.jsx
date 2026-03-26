import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store';
import FleetCard from '../components/FleetCard';
import { resolveImage } from '../utils/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, 
    Users, 
    CheckCircle2, 
    Truck,
    Briefcase,
    PlaneTakeoff,
    PackageOpen
} from 'lucide-react';

export default function OurFleet() {
    const dispatch = useDispatch();
    const { fleets, activeFilter, stats } = useSelector(state => state.transport);

    const categories = ['All', 'Bus', 'Travel', 'Cargo'];

    const filteredFleets = activeFilter === 'All'
        ? fleets
        : fleets.filter(f => f.type === activeFilter);

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            {/* 1. HERO FLEET & FILTER */}
            <section id="fleet" className="py-24 relative z-10 border-b border-white/5">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Vehicles</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter">
                            Premium <span className="text-amber-500">Fleet</span>
                        </h1>
                        <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
                            Eksplorasi armada premium kami yang dirancang khusus untuk kenyamanan eksekutif dan efisiensi logistik kelas berat.
                        </p>
                    </div>

                    {/* FILTER BUTTONS */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => dispatch(setFilter(cat))}
                                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                                    activeFilter === cat
                                        ? 'bg-amber-500 text-[#0B0F19] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* FLEET GRID */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredFleets.map((f) => (
                                <motion.div
                                    key={f.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <FleetCard {...f} img={resolveImage(f.img)} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredFleets.length === 0 && (
                        <div className="text-center py-20 text-slate-400 italic">
                            Armada tidak ditemukan untuk kategori ini.
                        </div>
                    )}
                </div>
            </section>

            {/* 2. IDEAL USE CASES */}
            <section className="py-24 relative overflow-hidden bg-[#080B13] border-b border-white/5">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-4">
                            Ideal <span className="text-amber-500">Use Cases</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Berbagai skenario perjalanan dan pengiriman yang sangat cocok menggunakan armada spesifik yang kami sediakan.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Corporate Events</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Sempurna untuk Rapat Kerja Nasional (Rakernas), Outing Perusahaan, atau Study Tour Eksekutif. Dilengkapi dengan fasilitas VVIP di dalam bus pariwisata kami.
                            </p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors">
                                <PlaneTakeoff size={32} />
                            </div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Airport Transfer</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Mobilitas cepat dari dan ke bandara internasional bagi tamu VIP Anda. Menggunakan armada Hiace Premio yang mengedepankan privasi dan kenyamanan.
                            </p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors">
                                <PackageOpen size={32} />
                            </div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Industrial Logistics</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Angkutan kargo logistik skala besar (Pabrik, Gudang, FMCG) dengan Wingbox Tronton dan Blind Van yang tangguh untuk rute lintas provinsi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. STATISTICS */}
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

        </div>
    );
}