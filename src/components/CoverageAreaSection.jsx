import React from 'react';
import { Globe } from 'lucide-react';
import { coverageAreas, coverageContent } from '../data/coverageAreas';

export default function CoverageAreaSection() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden border-y border-white/5">
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                <div className="text-center mb-10 md:mb-16">
                    <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6">
                        <Globe size={40} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter mb-4 md:mb-6">{coverageContent.title} <span className="text-amber-500">{coverageContent.highlight}</span></h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        {coverageContent.desc}
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {coverageAreas.map((area, idx) => (
                        <div key={idx} className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-[16px] md:rounded-[24px] hover:bg-amber-500 hover:text-[#0B0F19] hover:border-amber-500 transition-colors group">
                            <h4 className="text-white group-hover:text-[#0B0F19] font-bold uppercase tracking-wide">{area}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
