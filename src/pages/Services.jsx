import React from 'react';
import { useSelector } from 'react-redux';
import { resolveImage } from '../utils/assets';
import { CheckCircle2 } from 'lucide-react';

import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import CoverageAreaSection from '../components/CoverageAreaSection';

export default function Services() {
    const sp = useSelector(state => state.transport.servicesPageContent);

    // Services page text from spreadsheet
    const ecoTitle1 = sp?.eco_title_1 || 'Comprehensive';
    const ecoTitle2 = sp?.eco_title_2 || 'Transport Ecosystem';
    const ecoPara1 = sp?.eco_para_1 || 'TransElite menyediakan ekosistem transportasi hulu ke hilir.';
    const ecoPara2 = sp?.eco_para_2 || 'Setiap layanan dirancang dengan protokol keamanan ketat dan dukungan kru profesional.';
    const ecoFeature1 = sp?.eco_feature_1 || 'Terintegrasi penuh dengan ekosistem IT logistik';
    const ecoFeature2 = sp?.eco_feature_2 || 'Perlindungan asuransi pengiriman komprehensif';
    const ecoFeature3 = sp?.eco_feature_3 || 'Skalabilitas tinggi untuk proyek tender korporasi';

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[60px] md:pt-[75px]">
            <ServicesSection isHero={true} />

            <section className="py-16 md:py-24 relative overflow-hidden bg-[#080B13]">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tighter mb-6 md:mb-8">
                            {ecoTitle1} <br />
                            <span className="text-amber-500">{ecoTitle2}</span>
                        </h2>
                        <div className="flex flex-col gap-6 text-slate-400 leading-relaxed text-lg mb-8">
                            <p>{ecoPara1}</p>
                            <p>{ecoPara2}</p>
                        </div>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20} /> {ecoFeature1}</li>
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20} /> {ecoFeature2}</li>
                            <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="text-amber-500" size={20} /> {ecoFeature3}</li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/3] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={resolveImage("bus-fleet.jpg")} className="w-full h-full object-cover" alt="Service Detail" />
                        </div>
                    </div>
                </div>
            </section>

            <FeaturesSection variant="services" />
            <CoverageAreaSection />
        </div>
    );
}