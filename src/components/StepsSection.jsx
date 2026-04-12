import React from 'react';
import { renderIcon } from '../utils/icons';
import { steps, stepsContent } from '../data/steps';

export default function StepsSection() {
    return (
        <section className="py-16 md:py-24 bg-[#080B13] border-y border-white/5 relative z-10">
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 text-center">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                    <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">{stepsContent.badge}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter mb-10 md:mb-16">
                    {stepsContent.title} <span className="text-amber-500">{stepsContent.highlight}</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 relative">
                    <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0"></div>

                    {steps.map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center group">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#0B0F19] border-4 border-[#080B13] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_2px_rgba(245,158,11,1)] flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 group-hover:-translate-y-2">
                                <div className="text-slate-400 group-hover:text-amber-500 transition-colors">
                                    {renderIcon(item.icon, { size: 24, className: "md:w-8 md:h-8" })}
                                </div>
                            </div>
                            <div className="text-amber-500 font-black italic text-xl mb-2">{stepsContent.stepPrefix} {item.step}</div>
                            <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                            <p className="text-slate-400 text-sm max-w-[200px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
