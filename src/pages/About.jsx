import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImage } from '../utils/assets';
import { CheckCircle2, Target, Eye, Shield, HeartHandshake, ArrowRight, TrendingUp } from 'lucide-react';

export default function About() {
    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[75px]">
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/5 bg-[#080B13]">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">About Us</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter mb-6">DRIVING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">FUTURE</span><br/> OF LOGISTICS</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">TransElite adalah penyedia layanan transportasi dan logistik premium yang berdedikasi untuk memberikan solusi pengiriman dan perjalanan yang aman, efisien, dan modern.</p>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-square lg:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={resolveImage("bus-fleet.jpg")} className="w-full h-full object-cover" alt="Company Overview" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 p-4 bg-amber-500 rounded-2xl">
                                <span className="text-[#0B0F19] font-black text-2xl italic leading-none block px-2">10+ YEARS</span>
                                <span className="text-[#0B0F19] tracking-widest font-bold text-xs uppercase block px-2 mt-1">Experience</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tighter mb-8">A Legacy of <span className="text-amber-500">Excellence</span></h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg">
                            <p>Berdiri sejak lebih dari satu dekade lalu, TransElite bertransformasi dari penyedia armada lokal menjadi perusahaan penyedia solusi logistik dan transportasi nasional berskala premium.</p>
                            <p>Kami memahami bahwa di dunia logistik modern, efisiensi dan keandalan adalah kunci utama.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#080B13] border-y border-white/5 relative">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors"><Eye size={120} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10"><Eye size={32} /></div>
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tight mb-4 relative z-10">Our Vision</h3>
                        <p className="text-slate-400 text-lg leading-relaxed relative z-10">Menjadi penyedia layanan transportasi dan logistik premium nomor satu di Indonesia.</p>
                    </div>
                    <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-amber-500/50 transition duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors"><Target size={120} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-[#0B0F19] mb-8 relative z-10"><Target size={32} /></div>
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tight mb-4 relative z-10">Our Mission</h3>
                        <ul className="text-slate-400 text-lg leading-relaxed flex flex-col gap-3 relative z-10">
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Menyediakan armada transportasi darat modern berstandar premium.</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Menerapkan keunggulan operasional 24/7.</li>
                            <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> Membangun kemitraan strategis dengan entitas korporat nasional.</li>
                        </ul>
                    </div>
                </div>
            </section>


            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">Our Core <span className="text-amber-500">Values</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><Shield size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Integrity</h4>
                            <p className="text-slate-400 text-sm">Menjalankan operasional dengan standar integritas dan keamanan tertinggi di industri.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><HeartHandshake size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Reliability</h4>
                            <p className="text-slate-400 text-sm">Akurat dan dapat diandalkan adalah janji utama yang selalu kami penuhi bagi setiap klien.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6"><TrendingUp size={32} /></div>
                            <h4 className="text-white text-xl font-bold italic mb-4 uppercase">Excellence</h4>
                            <p className="text-slate-400 text-sm">Berkomitmen pada inovasi berkelanjutan untuk selalu berada di garis depan layanan logistik.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative z-10 border-t border-white/10 bg-[#080B13]">
                <div className="max-w-[70rem] mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-[4rem] font-black italic uppercase text-white tracking-tighter mb-6 leading-none">Partner With <br/><span className="text-amber-500">TransElite Today</span></h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Tingkatkan efisiensi bisnis Anda dengan dukungan sistem logistik dan transportasi terbaik.</p>
                    <Link to="/contact" className="inline-flex items-center gap-3 bg-amber-500 text-[#0B0F19] px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300">Contact Us Now <ArrowRight size={20} /></Link>
                </div>
            </section>
        </div>
    );
}
