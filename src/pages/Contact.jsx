import { Phone, Mail } from 'lucide-react';

const WA_NUMBER = '6287788332767';

export default function Contact() {
    const waMessage = encodeURIComponent(
        'Halo TransElite, saya ingin bertanya mengenai layanan transportasi Anda. Mohon informasi lebih lanjut.'
    );

    return (
        <section id="contact" className="py-16 md:py-24 bg-[#0B0F19] px-4 md:px-6 pt-[76px] md:pt-[99px]">
            <div className="max-w-7xl mx-auto bg-slate-900 rounded-[24px] md:rounded-[50px] p-6 sm:p-8 md:p-12 lg:p-24 text-white grid md:grid-cols-2 gap-8 md:gap-10 items-center border border-white/10">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase mb-4 tracking-tighter leading-none">Siap Untuk <span className="text-amber-500">Berangkat?</span></h2>
                    <p className="text-slate-400 italic font-light mb-6 md:mb-8 text-sm md:text-base">Hubungi tim konsultan transportasi kami untuk penawaran harga terbaik.</p>
                    <div className="space-y-4">
                        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 md:gap-4 text-base md:text-xl font-bold uppercase italic hover:text-amber-500 transition-colors">
                            <Phone className="text-amber-500 shrink-0" size={20} /> +62 877 8833 2767
                        </a>
                        <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl font-bold uppercase italic"><Mail className="text-amber-500 shrink-0" size={20} /> book@transelite.com</div>
                    </div>
                </div>
                <a
                    href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 md:py-5 bg-amber-500 text-black font-black uppercase rounded-xl md:rounded-2xl hover:scale-105 transition shadow-2xl shadow-amber-500/20 text-center block text-sm md:text-base tracking-widest"
                >
                    HUBUNGI VIA WHATSAPP
                </a>
            </div>
        </section>
    );
}