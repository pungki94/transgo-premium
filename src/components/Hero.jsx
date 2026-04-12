import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveSlideImage } from '../utils/assets';
import { slides } from '../data/slides';

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 150 : -150,
        opacity: 0,
        scale: 1.15,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { 
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.8 },
            scale: { duration: 8, ease: "easeOut" }
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? -150 : 150,
        opacity: 0,
        scale: 0.95,
        transition: { 
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.5 }
        },
    }),
};

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const goToSlide = useCallback((index) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    }, [current]);

    const nextSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides]);

    const prevSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides]);

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (isPaused || !slides || slides.length === 0) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [isPaused, slides, nextSlide]);

    const activeSlide = slides[current];

    return (
        <section id="home" className="relative min-h-screen flex items-center bg-[#0B0F19] overflow-hidden pt-20 md:pt-28 pb-10 md:pb-16">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-16 items-center">
                
                {/* Left: Text Content */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left text-white w-full lg:col-span-5 relative z-20 mt-4 lg:mt-0">
                    <div className="inline-flex items-center gap-2 mb-4 lg:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                        <span className="text-amber-500 font-bold tracking-widest sm:tracking-[0.2em] uppercase text-[9px] sm:text-xs">Premium Logistics & Travel</span>
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] font-black italic uppercase leading-[0.95] sm:leading-[0.9] mb-4 sm:mb-6 tracking-tighter drop-shadow-2xl">
                        ELITE <br className="hidden lg:block"/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                            TRANSPORT
                        </span> <br className="hidden lg:block"/> 
                        SOLUTIONS.
                    </h1>
                    
                    <p className="text-slate-400 text-sm sm:text-base lg:text-xl mb-6 sm:mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
                        Experience the next generation of transportation with our modern fleet of premium vehicles designed for ultimate comfort, safety, and reliability.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
                        <Link to="/fleet" className="group flex justify-center items-center gap-2 sm:gap-3 bg-amber-500 text-[#0B0F19] px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 text-center w-full sm:w-auto">
                            Explore Fleet
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/contact" className="flex justify-center items-center gap-2 sm:gap-3 bg-transparent border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold uppercase text-xs sm:text-sm tracking-widest hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-center">
                            Book Now
                        </Link>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-row justify-center lg:justify-start lg:grid lg:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10 w-full max-w-xl">
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <ShieldCheck className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            <span className="text-white font-bold text-[10px] sm:text-sm whitespace-nowrap">Safe & Secure</span>
                        </div>
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <Clock className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            <span className="text-white font-bold text-[10px] sm:text-sm whitespace-nowrap">On-Time Always</span>
                        </div>
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <Award className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            <span className="text-white font-bold text-[10px] sm:text-sm whitespace-nowrap">Premium Service</span>
                        </div>
                    </div>
                </div>

                {/* Right: Slider Visual */}
                <div
                    className="relative w-full h-[45vh] sm:h-[55vh] lg:min-h-[650px] xl:min-h-[750px] flex items-center justify-center lg:col-span-7 group/slider perspective-1000 mt-2 lg:mt-0"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {!activeSlide ? (
                        <div className="relative w-full aspect-square sm:aspect-auto lg:aspect-auto h-full lg:h-full lg:w-full max-w-[500px] lg:max-w-none mx-auto opacity-50">
                            <div className="absolute inset-0 border border-amber-500/10 rounded-[2rem] lg:rounded-[3rem] rotate-2 lg:rotate-3 scale-95" />
                            <div className="absolute inset-0 border border-white/5 rounded-[2rem] lg:rounded-[3rem] -rotate-2 lg:-rotate-3 scale-95" />
                            <div className="absolute inset-2 sm:inset-4 lg:inset-4 xl:inset-6 rounded-[1.8rem] lg:rounded-[3rem] bg-white/5 animate-pulse ring-1 ring-white/10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="relative w-full aspect-square sm:aspect-auto lg:aspect-auto h-full lg:h-full lg:w-full max-w-[500px] lg:max-w-none mx-auto">
                        {/* Decorative Background Frame */}
                        <div className="absolute inset-0 border border-amber-500/30 rounded-[2rem] lg:rounded-[3rem] rotate-2 lg:rotate-3 scale-95 transition-all duration-700 ease-out group-hover/slider:rotate-1 group-hover/slider:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.1)] lg:shadow-[0_0_50px_rgba(245,158,11,0.15)]" />
                        <div className="absolute inset-0 border border-white/20 rounded-[2rem] lg:rounded-[3rem] -rotate-2 lg:-rotate-3 scale-95 transition-all duration-700 ease-out group-hover/slider:-rotate-1 group-hover/slider:scale-[1.02]" />
                        
                        {/* Main Image Container */}
                        <div className="absolute inset-2 sm:inset-4 lg:inset-4 xl:inset-6 rounded-[1.8rem] lg:rounded-[3rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] lg:shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10 ring-1 ring-white/10 transition-transform duration-1000 ease-out group-hover/slider:scale-[1.01]">
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F19]/80 via-transparent to-transparent z-10" />
                        
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.img
                                key={activeSlide.id}
                                src={resolveSlideImage(activeSlide.image)}
                                alt={activeSlide.alt}
                                className="absolute inset-0 w-full h-full object-cover"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            />
                        </AnimatePresence>

                        

                        {/* Floating Stats Badge — dynamic per slide */}
                        <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 z-20 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 p-2 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-4 transform transition-transform duration-500 hover:-translate-y-1 lg:hover:-translate-y-2">
                            <div className="bg-amber-500 text-[#0B0F19] font-black text-sm lg:text-2xl p-2 lg:p-4 rounded-lg lg:rounded-xl">
                                {activeSlide.stat}
                            </div>
                            <div className="text-white text-[9px] lg:text-xs font-bold uppercase tracking-widest leading-snug lg:leading-relaxed whitespace-pre-line">
                                {activeSlide.statLabel}
                            </div>
                        </div>

                        {/* Floating Badge — dynamic per slide */}
                        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-1.5 lg:gap-2">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                            <span className="text-white text-[8px] lg:text-xs font-bold tracking-widest uppercase">{activeSlide.badge}</span>
                        </div>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 lg:gap-2">
                            {slides && slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`rounded-full transition-all duration-300 ${
                                        index === current
                                            ? 'w-4 h-1 lg:w-8 lg:h-2.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                            : 'w-1 h-1 lg:w-2.5 lg:h-2.5 bg-white/40 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                        </div>
                    </div>
                    )}
                </div>

            </div>
        </section>
    );
}