import { Bus, Truck, Car, Package, Globe } from 'lucide-react';

const iconMap = { Bus: <Bus />, Truck: <Truck />, Car: <Car />, Package: <Package />, Globe: <Globe /> };

export default function ServiceCard({ title, desc, icon }) {
    return (
        <div className="p-6 md:p-10 bg-white/5 border border-white/5 rounded-[24px] md:rounded-[40px] hover:border-amber-500/50 transition group">
            <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform">{iconMap[icon]}</div>
            <h3 className="text-white text-xl font-bold italic capitalize mb-4 tracking-tight">{title.toLowerCase()}</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">{desc}</p>
        </div>
    );
}