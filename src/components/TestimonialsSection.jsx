import React from 'react';
import { Star } from 'lucide-react';
import { testimonials, testimonialsContent } from '../data/testimonials';

export default function TestimonialsSection() {
    return (
        <section className="py-24 relative z-10">
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">{testimonialsContent.badge}</span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">
                        {testimonialsContent.title} <span className="text-amber-500">{testimonialsContent.highlight}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
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
    );
}
