import React from 'react';
import { useSelector } from 'react-redux';
import { Globe } from 'lucide-react';

export default function CoverageAreaSection() {
    const coverageAreas = useSelector(state => state.transport.coverageAreas);
    const coverageContent = useSelector(state => state.transport.coverageContent);

    return (
        <section className="min-h-screen flex items-center py-16 md:py-24 relative overflow-hidden border-y border-white/5">
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full">
                <div className="text-center mb-24 md:mb-32">
                    <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6">
                        <Globe size={40} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic capitalize text-white tracking-tighter mb-4 md:mb-6">{coverageContent.title?.toLowerCase() || 'Nationwide'} <span className="text-amber-500">{coverageContent.highlight?.toLowerCase() || 'Coverage'}</span></h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        {coverageContent.desc || ''}
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center justify-center">
                    {coverageAreas.map((item, idx) => {
                        const areaName = typeof item === 'string' ? item : (item.area || '');
                        return (
                            <div key={idx} className="p-4 md:p-6 h-full min-h-[120px] flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[16px] md:rounded-[24px] hover:bg-amber-500 hover:text-[#0B0F19] hover:border-amber-500 transition-colors group">
                                <span className="text-white group-hover:text-[#0B0F19] font-bold capitalize tracking-wide m-0 leading-tight my-auto">{areaName.toLowerCase()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
