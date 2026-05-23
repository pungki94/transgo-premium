import { useSelector } from 'react-redux';
import { Phone, Mail } from 'lucide-react';

export default function Contact() {
    const contact = useSelector(state => state.transport.contact);

    const waNumber = contact?.wa_number || '6287788332767';
    const phone = contact?.phone || '+62 877 8833 2767';
    const email = contact?.email || 'book@transelite.com';
    const contactTitle1 = contact?.contact_title_1 || 'Siap Untuk';
    const contactTitle2 = contact?.contact_title_2 || 'Berangkat?';
    const contactDesc = contact?.contact_desc || 'Hubungi tim konsultan transportasi kami untuk penawaran harga terbaik.';
    const contactWaText = contact?.wa_text || 'Halo TransElite, saya ingin bertanya mengenai layanan transportasi Anda. Mohon informasi lebih lanjut.';
    const contactWaButton = contact?.wa_button || 'HUBUNGI VIA WHATSAPP';

    const waMessage = encodeURIComponent(contactWaText);

    return (
        <section id="contact" className="w-full flex-1 min-h-[60vh] md:min-h-[calc(100vh-320px)] flex flex-col justify-center py-16 md:py-20 bg-[#0B0F19] px-4 md:px-6 pt-[120px] md:pt-[150px]">
            <div className="w-full max-w-7xl mx-auto bg-slate-900 rounded-[24px] md:rounded-[50px] p-6 sm:p-8 md:p-12 lg:p-24 text-white grid md:grid-cols-2 gap-8 md:gap-10 items-center border border-white/10">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase mb-4 tracking-tighter leading-none">{contactTitle1} <span className="text-amber-500">{contactTitle2}</span></h2>
                    <p className="text-slate-400 italic font-light mb-6 md:mb-8 text-sm md:text-base">{contactDesc}</p>
                    <div className="space-y-4">
                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 md:gap-4 text-base md:text-xl font-bold uppercase italic hover:text-amber-500 transition-colors">
                            <Phone className="text-amber-500 shrink-0" size={20} /> {phone}
                        </a>
                        <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl font-bold uppercase italic"><Mail className="text-amber-500 shrink-0" size={20} /> {email}</div>
                    </div>
                </div>
                <a
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[60px] md:min-h-[70px] px-6 bg-amber-500 text-black font-black uppercase rounded-xl md:rounded-2xl hover:scale-105 transition shadow-2xl shadow-amber-500/20 flex flex-col justify-center items-center text-center text-sm md:text-base tracking-widest"
                >
                    <span>{contactWaButton}</span>
                </a>
            </div>
        </section>
    );
}