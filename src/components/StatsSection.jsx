import React from 'react';
import { useSelector } from 'react-redux';
import { renderIcon } from '../utils/icons';

export default function StatsSection() {
    const stats = useSelector(state => state.transport.stats);
    const statsContent = useSelector(state => state.transport.statsContent);

    return (
        <section className="py-12 md:py-20 bg-amber-500 relative z-10">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-6 text-center divide-x-0 lg:divide-x lg:divide-black/10">
                    {statsContent.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            {renderIcon(item.icon, { size: 40, className: "text-[#0B0F19] mb-4 opacity-50" })}
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0B0F19] tracking-tighter mb-2">{stats[item.key] || '—'}</h3>
                            <p className="text-[#0B0F19] font-bold capitalize tracking-widest text-[10px] sm:text-xs md:text-sm">{item.label.toLowerCase()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
