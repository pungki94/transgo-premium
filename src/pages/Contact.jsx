import { Phone, Mail } from 'lucide-react';

const WA_NUMBER = '6287788332767';

export default function Contact() {
    const waMessage = encodeURIComponent(
        'Halo TransElite, saya ingin bertanya mengenai layanan transportasi Anda. Mohon informasi lebih lanjut.'
    );

    return (
        <section id="contact" className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto bg-slate-900 rounded-[50px] p-12 lg:p-24 text-white grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 className="text-5xl font-black italic uppercase mb-4 tracking-tighter leading-none">Siap Untuk <span className="text-amber-500">Berangkat?</span></h2>
                    <p className="text-slate-400 italic font-light mb-8">Hubungi tim konsultan transportasi kami untuk penawaran harga terbaik.</p>
                    <div className="space-y-4">
                        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl font-bold uppercase italic hover:text-amber-500 transition-colors">
                            <Phone className="text-amber-500" /> +62 877 8833 2767
                        </a>
                        <div className="flex items-center gap-4 text-xl font-bold uppercase italic"><Mail className="text-amber-500" /> book@transelite.com</div>
                    </div>
                </div>
                <a
                    href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-amber-500 text-black font-black uppercase rounded-2xl hover:scale-105 transition shadow-2xl shadow-amber-500/20 text-center block"
                >
                    HUBUNGI VIA WHATSAPP
                </a>
            </div>
        </section>
    );
}