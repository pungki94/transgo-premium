import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resolveImage } from '../utils/assets';
import { CheckCircle2, Target, Eye, Shield, HeartHandshake, ArrowRight, TrendingUp } from 'lucide-react';

export default function About() {
    const aboutContent = useSelector(state => state.transport.aboutContent);

    // About page text from spreadsheet
    const headerTitle1 = aboutContent?.header_title_1 || '';
    const headerHighlight = aboutContent?.header_highlight || '';
    const headerTitle2 = aboutContent?.header_title_2 || '';
    const headerDesc = aboutContent?.header_desc || '';

    const storyTitle1 = aboutContent?.story_title_1 || '';
    const storyHighlight = aboutContent?.story_highlight || '';
    const storyPara1 = aboutContent?.story_para_1 || '';
    const storyPara2 = aboutContent?.story_para_2 || '';
    const storyBadge = aboutContent?.story_badge || '';
    const storyBadgeSub = aboutContent?.story_badge_sub || '';

    const visionText = aboutContent?.vision_text || '';
    const mission1 = aboutContent?.mission_1 || '';
    const mission2 = aboutContent?.mission_2 || '';
    const mission3 = aboutContent?.mission_3 || '';

    const value1Title = aboutContent?.value_1_title || '';
    const value1Desc = aboutContent?.value_1_desc || '';
    const value2Title = aboutContent?.value_2_title || '';
    const value2Desc = aboutContent?.value_2_desc || '';
    const value3Title = aboutContent?.value_3_title || '';
    const value3Desc = aboutContent?.value_3_desc || '';

    const ctaTitle1 = aboutContent?.cta_title_1 || '';
    const ctaTitle2 = aboutContent?.cta_title_2 || '';
    const ctaDesc = aboutContent?.cta_desc || '';
    const ctaButton = aboutContent?.cta_button || '';
    const aboutBadge = aboutContent?.about_badge || '';
    const visionTitle = aboutContent?.vision_title || '';
    const missionTitle = aboutContent?.mission_title || '';
    const valuesTitle1 = aboutContent?.values_title_1 || '';
    const valuesTitle2 = aboutContent?.values_title_2 || '';

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[60px] md:pt-[75px]">
            <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden border-b border-white/5 bg-[#080B13]">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-amber-500 font-bold tracking-[0.2em] capitalize text-xs">{aboutBadge.toLowerCase()}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic capitalize text-white tracking-tighter mb-6">{headerTitle1.toLowerCase()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 inline-block pr-3">{headerHighlight.toLowerCase()}</span><br /> {headerTitle2.toLowerCase()}</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{headerDesc}</p>
                </div>
            </section>

            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-square lg:aspect-[4/3] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={resolveImage("bus-fleet.jpg")} className="w-full h-full object-cover" alt="Company Overview" />
                            <div className="absolute bottom-8 left-8 p-4 bg-amber-500 rounded-2xl">
                                <span className="text-[#0B0F19] font-black text-2xl italic leading-none block px-2">{storyBadge}</span>
                                <span className="text-[#0B0F19] tracking-widest font-bold text-xs capitalize block px-2 mt-1">{storyBadgeSub.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic capitalize text-white tracking-tighter mb-6 md:mb-8">{storyTitle1.toLowerCase()} <span className="text-amber-500">{storyHighlight.toLowerCase()}</span></h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg">
                            <p>{storyPara1}</p>
                            <p>{storyPara2}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-[#080B13] border-y border-white/5 relative">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors"><Eye size={120} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10"><Eye size={32} /></div>
                        <h3 className="text-3xl font-black italic text-white capitalize tracking-tight mb-4 relative z-10">{visionTitle.toLowerCase()}</h3>
                        <p className="text-slate-400 text-lg leading-relaxed relative z-10">{visionText}</p>
                    </div>
                    <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors"><Target size={120} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10"><Target size={32} /></div>
                        <h3 className="text-3xl font-black italic text-white capitalize tracking-tight mb-4 relative z-10">{missionTitle.toLowerCase()}</h3>
                        <ul className="text-slate-400 text-lg leading-relaxed flex flex-col gap-3 relative z-10">
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> {mission1}</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> {mission2}</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> {mission3}</li>
                        </ul>
                    </div>
                </div>
            </section>


            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic capitalize text-white tracking-tighter">{valuesTitle1.toLowerCase()} <span className="text-amber-500">{valuesTitle2.toLowerCase()}</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><Shield size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 capitalize">{value1Title.toLowerCase()}</h4>
                            <p className="text-slate-400 text-sm">{value1Desc}</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><HeartHandshake size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 capitalize">{value2Title.toLowerCase()}</h4>
                            <p className="text-slate-400 text-sm">{value2Desc}</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><TrendingUp size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 capitalize">{value3Title.toLowerCase()}</h4>
                            <p className="text-slate-400 text-sm">{value3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative z-10 border-t border-white/10 bg-[#080B13]">
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black italic capitalize text-white tracking-tighter mb-4 md:mb-6 leading-none">{ctaTitle1.toLowerCase()} <br /><span className="text-amber-500">{ctaTitle2.toLowerCase()}</span></h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">{ctaDesc}</p>
                    <Link to="/contact" className="inline-flex items-center gap-3 bg-amber-500 text-[#0B0F19] px-10 py-5 rounded-2xl font-black capitalize tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300">{ctaButton.toLowerCase()} <ArrowRight size={20} /></Link>
                </div>
            </section>
        </div>
    );
}
