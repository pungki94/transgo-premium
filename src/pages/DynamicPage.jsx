import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { parseList } from '../utils/sheetParser';

export default function DynamicPage() {
    const { slug } = useParams();
    const { dynamicPages } = useSelector(state => state.transport);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Find the sheet name corresponding to this slug
    const pageInfo = dynamicPages.find(p => p.path === `/${slug}`);
    const sheetName = pageInfo ? pageInfo.sheetName : null;

    useEffect(() => {
        if (!sheetName) {
            setError('Page not found');
            setLoading(false);
            return;
        }

        async function loadContent() {
            try {
                setLoading(true);
                const data = await api.getKV(sheetName);
                if (Object.keys(data).length === 0) {
                    setError('This page has no content yet.');
                } else {
                    setContent(data);
                }
            } catch (err) {
                setError('Failed to load page content.');
            } finally {
                setLoading(false);
            }
        }

        loadContent();
    }, [sheetName]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-amber-500">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">{error || 'Page Not Found'}</h2>
                <p>Please check the spreadsheet sheet named "{sheetName || slug}"</p>
            </div>
        );
    }

    // Extract dynamic fields (Title Case already handled by CSS capitalize + JS toLowerCase where needed)
    const badge = (content.badge || content.page_badge || sheetName || '').toLowerCase();
    const title = (content.title || content.page_title || '').toLowerCase();
    const highlight = (content.highlight || content.page_highlight || '').toLowerCase();
    const description = content.description || content.page_desc || content.desc || '';

    // Parse any list items (e.g. feature_1_title, feature_2_title)
    const features = parseList(content, 'feature', ['title', 'desc']);

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[80px] md:pt-[110px]">
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] capitalize text-xs">{badge}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5_xl md:text-6xl lg:text-7xl font-black italic capitalize text-white tracking-tighter mb-6">
                            {title} <span className="text-amber-500">{highlight}</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {features.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                            {features.map((f, i) => (
                                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:border-amber-500/30 transition-colors group">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-white text-xl font-bold italic capitalize mb-4 tracking-tight">{f.title?.toLowerCase()}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
