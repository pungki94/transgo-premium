import React from 'react';
import { renderIcon } from '../utils/icons';
import { resolveImage } from '../utils/assets';
import { Star } from 'lucide-react';
import { features, featuresContent } from '../data/features';

export default function FeaturesSection({ variant = "home" }) {
    return (
        <section className={`py-16 md:py-24 relative overflow-hidden ${variant === 'home' ? 'bg-[#080B13] border-y border-white/5' : 'border-y border-white/5'}`}>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-10 md:gap-16 relative z-10">
                <div className={`w-full lg:w-1/2 relative ${variant === 'services' ? 'hidden lg:block' : ''}`}>
                    <div className="aspect-[4/3] md:aspect-[4/5] rounded-[24px] md:rounded-[40px] overflow-hidden relative shadow-2xl">
                        <img 
                            src={resolveImage(variant === 'home' ? "bus-fleet.jpg" : "truck-fleet.png")} 
                            alt="Elite Fleet" 
                            className={`w-full h-full object-cover ${variant === 'services' ? 'grayscale hover:grayscale-0 transition-all duration-700' : ''}`} 
                        />
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
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">{featuresContent.badge}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter mb-6">
                        {featuresContent.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{featuresContent.highlight}</span> {featuresContent.suffix}
                    </h2>
                    {variant === 'home' && (
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            {featuresContent.desc}
                        </p>
                    )}

                    <div className={`flex flex-col gap-6 ${variant === 'services' ? 'mt-10' : ''}`}>
                        {features.map((feature, i) => (
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
            </div>
        </section>
    );
}
