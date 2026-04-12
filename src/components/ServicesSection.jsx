import React from 'react';
import ServiceCard from './ServiceCard';
import { services, servicesContent } from '../data/services';

export default function ServicesSection({ isHero = false }) {
    return (
        <section className={`py-16 md:py-24 relative z-10 ${isHero ? 'lg:py-32 border-b border-white/5' : ''}`} id={isHero ? "services-hero" : ""}>
            {isHero && <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />}
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">{servicesContent.badge}</span>
                    </div>
                    {isHero ? (
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter">
                            {servicesContent.title} <span className="text-amber-500">{servicesContent.highlight}</span>
                        </h1>
                    ) : (
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase text-white tracking-tighter">
                            {servicesContent.title} <span className="text-amber-500">{servicesContent.highlight}</span>
                        </h2>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map(s => (
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
    );
}
