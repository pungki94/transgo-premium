import Hero from '../components/Hero';

import StatsSection from '../components/StatsSection';
import StepsSection from '../components/StepsSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
    return (
        <div id="home" className="bg-[#0B0F19] min-h-screen font-sans overflow-hidden">
            <Hero />
            <StepsSection />
            <StatsSection />
            <TestimonialsSection />
        </div>
    );
}