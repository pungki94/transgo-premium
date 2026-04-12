import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store';
import FleetCard from '../components/FleetCard';
import { resolveImage } from '../utils/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, PlaneTakeoff, PackageOpen } from 'lucide-react';

export default function OurFleet() {
    const dispatch = useDispatch();
    const { fleets, activeFilter } = useSelector(state => state.transport);
    const categories = ['All', 'Bus', 'Travel', 'Cargo'];
    const filteredFleets = activeFilter === 'All' ? fleets : fleets.filter(f => f.type === activeFilter);

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            <section id="fleet" className="py-24 relative z-10 border-b border-white/5">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Our Vehicles</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter">Premium <span className="text-amber-500">Fleet</span></h1>
                        <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">Eksplorasi armada premium kami yang dirancang khusus untuk kenyamanan eksekutif dan efisiensi logistik kelas berat.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => dispatch(setFilter(cat))}
                                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border ${activeFilter === cat ? 'bg-amber-500 text-[#0B0F19] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'}`}>{cat}</button>
                        ))}
                    </div>
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredFleets.map((f) => (
                                <motion.div key={f.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                                    <FleetCard {...f} img={
                                        f.name?.toLowerCase() === 'mini bus' ? resolveImage('mini-bus.png') :
                                        f.name?.toLowerCase() === 'medium bus' ? resolveImage('bus-medium.png') :
                                        resolveImage(f.img)
                                    } />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    {filteredFleets.length === 0 && (<div className="text-center py-20 text-slate-400 italic">Armada tidak ditemukan untuk kategori ini.</div>)}
                </div>
            </section>

            <section className="py-24 relative overflow-hidden bg-[#080B13] border-b border-white/5">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-4">Ideal <span className="text-amber-500">Use Cases</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Berbagai skenario perjalanan dan pengiriman yang cocok menggunakan armada kami.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors"><Briefcase size={32} /></div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Corporate Events</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Sempurna untuk Rakernas, Outing Perusahaan, atau Study Tour Eksekutif dengan fasilitas VVIP.</p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors"><PlaneTakeoff size={32} /></div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Airport Transfer</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Mobilitas cepat dari dan ke bandara internasional dengan armada Hiace Premio.</p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors"><PackageOpen size={32} /></div>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">Industrial Logistics</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Angkutan kargo logistik skala besar dengan Wingbox Tronton dan Blind Van.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}