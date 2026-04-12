import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FleetCard({ name, cap, type, img, features = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="group relative h-[450px] rounded-[50px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <img src={img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:blur-sm" alt={name} />

                {/* Default overlay visible initially */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B13] via-black/20 to-transparent p-10 flex flex-col justify-end transition-opacity duration-500 group-hover:opacity-0">
                    <span className="bg-amber-500 text-[#0B0F19] w-fit px-3 py-1 rounded-md text-[10px] font-black uppercase mb-3 italic">{type}</span>
                    <h3 className="text-white text-3xl font-black uppercase italic mb-1">{name}</h3>
                    <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">{cap}</p>
                </div>

                {/* Hover details overlay */}
                <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-md p-10 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-8 right-8 text-amber-500 bg-white/5 p-2 rounded-xl group-hover:scale-110 transition-transform">
                        <Maximize2 size={24} />
                    </div>
                    <span className="bg-amber-500 text-[#0B0F19] w-fit px-3 py-1 rounded-md text-[10px] font-black uppercase mb-4 italic">{type}</span>
                    <h3 className="text-white text-2xl font-black uppercase italic mb-2">{name}</h3>
                    <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6">{cap}</p>

                    {features.length > 0 && (
                        <ul className="flex flex-col gap-3 mb-8">
                            {features.map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                    <CheckCircle2 size={16} className="text-amber-500 shrink-0" /> {feat}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div
                        className="mt-auto inline-flex items-center justify-between bg-amber-500 text-[#0B0F19] px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300"
                    >
                        <span>View Details</span>
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>

            {/* FULLSCREEN DETAIL MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-sm cursor-pointer"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-5xl bg-[#080B13] rounded-[40px] shadow-2xl overflow-hidden border border-white/10 z-10 flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 w-12 h-12 bg-[#0B0F19]/50 hover:bg-amber-500 text-white hover:text-[#0B0F19] rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-md border border-white/10 hover:border-transparent"
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full md:w-1/2 h-64 md:h-auto shrink-0 relative">
                                <img src={img} alt={name} className="w-full h-full object-cover" />
                            </div>

                            <div className="w-full md:w-1/2 p-8 md:p-14 overflow-y-auto custom-scrollbar">
                                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 w-fit px-3 py-1 rounded-md text-[10px] font-black uppercase mb-4 italic block">{type}</span>
                                <h3 className="text-white text-4xl lg:text-5xl font-black uppercase italic mb-2 tracking-tight">{name}</h3>
                                <p className="text-amber-500 font-bold uppercase tracking-widest mb-10">{cap}</p>

                                <div className="mb-10">
                                    <h4 className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-white/10 rounded-full bg-white/5 text-white font-bold uppercase tracking-widest text-xs">
                                        Key Features
                                    </h4>
                                    <ul className="flex flex-col gap-4">
                                        {features.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-4 text-slate-300 text-sm lg:text-base">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                                                    <CheckCircle2 size={16} className="text-amber-500" />
                                                </div>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                    <a
                                        href={`https://wa.me/6287788332767?text=${encodeURIComponent(`Halo TransElite, saya tertarik untuk menyewa armada *${name}* (${type} - ${cap}). Mohon informasi lebih lanjut mengenai harga dan ketersediaan.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 inline-flex items-center justify-center gap-3 bg-amber-500 text-[#0B0F19] px-6 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        Book Fleet <ArrowRight size={18} />
                                    </a>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-none inline-flex items-center justify-center px-8 py-5 rounded-2xl font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}