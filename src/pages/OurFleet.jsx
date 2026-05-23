import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store';
import FleetCard from '../components/FleetCard';
import { resolveImage } from '../utils/assets';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Icon lookup map — allows spreadsheet to specify icon by name
const iconMap = {
    Briefcase: LucideIcons.Briefcase,
    PlaneTakeoff: LucideIcons.PlaneTakeoff,
    PackageOpen: LucideIcons.PackageOpen,
    Truck: LucideIcons.Truck,
    Bus: LucideIcons.Bus,
    Ship: LucideIcons.Ship,
    Building2: LucideIcons.Building2,
    MapPin: LucideIcons.MapPin,
    Clock: LucideIcons.Clock,
    Shield: LucideIcons.Shield,
    Users: LucideIcons.Users,
    Calendar: LucideIcons.Calendar,
    Package: LucideIcons.Package,
    Warehouse: LucideIcons.Warehouse,
    Globe: LucideIcons.Globe,
};
const getIcon = (name, fallback) => iconMap[name] || fallback;

export default function OurFleet() {
    const dispatch = useDispatch();
    const { fleets, activeFilter, fleetPageContent: fp, settings } = useSelector(state => state.transport);

    // Build unique categories dynamically from fleet data
    const allLabel = settings?.filter_all || 'All';
    const dynamicCategories = [...new Set(fleets.map(f => f.category).filter(Boolean))];
    const categories = [allLabel, ...dynamicCategories];

    // Filter by category field (or show all)
    const filteredFleets = activeFilter === allLabel ? fleets : fleets.filter(f => f.category === activeFilter);

    // Fleet page text from spreadsheet
    const pageBadge = fp?.page_badge || 'Our Vehicles';
    const pageTitle = fp?.page_title || 'Premium';
    const pageHighlight = fp?.page_highlight || 'Fleet';
    const pageDesc = fp?.page_desc || 'Eksplorasi armada premium kami yang dirancang khusus untuk kenyamanan eksekutif dan efisiensi logistik kelas berat.';
    const useCasesTitle = fp?.usecases_title || 'Ideal';
    const useCasesHighlight = fp?.usecases_highlight || 'Use Cases';
    const useCasesDesc = fp?.usecases_desc || 'Berbagai skenario perjalanan dan pengiriman yang cocok menggunakan armada kami.';
    const useCase1Title = fp?.usecase_1_title || 'Corporate Events';
    const useCase1Desc = fp?.usecase_1_desc || 'Sempurna untuk Rakernas, Outing Perusahaan, atau Study Tour Eksekutif dengan fasilitas VVIP.';
    const useCase2Title = fp?.usecase_2_title || 'Airport Transfer';
    const useCase2Desc = fp?.usecase_2_desc || 'Mobilitas cepat dari dan ke bandara internasional dengan armada Hiace Premio.';
    const useCase3Title = fp?.usecase_3_title || 'Industrial Logistics';
    const useCase3Desc = fp?.usecase_3_desc || 'Angkutan kargo logistik skala besar dengan Wingbox Tronton dan Blind Van.';
    const emptyText = fp?.empty_text || 'Armada tidak ditemukan untuk kategori ini.';

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[60px] md:pt-[75px]">
            <section id="fleet" className="py-8 md:py-12 relative z-10 border-b border-white/5">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">{pageBadge}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">{pageTitle} <span className="text-amber-500">{pageHighlight}</span></h1>
                        <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto">{pageDesc}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => dispatch(setFilter(cat))}
                                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border ${activeFilter === cat ? 'bg-amber-500 text-[#0B0F19] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'}`}>{cat}</button>
                        ))}
                    </div>
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence mode='popLayout'>
                            {filteredFleets.map((f) => {
                                const featuresArr = typeof f.features === 'string' ? f.features.split(',').map(s => s.trim()).filter(Boolean) : (f.features || []);
                                return (
                                    <motion.div key={f.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                                        <FleetCard {...f} features={featuresArr} img={resolveImage(f.image)} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                    {filteredFleets.length === 0 && (<div className="text-center py-20 text-slate-400 italic">{emptyText}</div>)}
                </div>
            </section>

            <section className="py-16 md:py-24 relative overflow-hidden bg-[#080B13] border-b border-white/5">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter mb-4">{useCasesTitle} <span className="text-amber-500">{useCasesHighlight}</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">{useCasesDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: getIcon(fp?.usecase_1_icon, LucideIcons.Briefcase), title: useCase1Title, desc: useCase1Desc },
                            { icon: getIcon(fp?.usecase_2_icon, LucideIcons.PlaneTakeoff), title: useCase2Title, desc: useCase2Desc },
                            { icon: getIcon(fp?.usecase_3_icon, LucideIcons.PackageOpen), title: useCase3Title, desc: useCase3Desc },
                        ].map((uc, i) => {
                            const Icon = uc.icon;
                            return (
                                <div key={i} className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] hover:border-amber-500/50 transition-colors group">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors"><Icon size={32} /></div>
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-4">{uc.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{uc.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </div>
    );
}