import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, fetchAllData } from '../store';
import FleetCard from '../components/FleetCard';
import { resolveImage } from '../utils/assets';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

// Icon lookup map — allows spreadsheet to specify icon by name
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const iconMap = {
    Briefcase: LucideIcons.Briefcase,
    PlaneTakeoff: LucideIcons.PlaneTakeoff,
    PackageOpen: LucideIcons.PackageOpen,
    Truck: LucideIcons.Truck,
    Bus: LucideIcons.Bus,
    Ship: LucideIcons.Ship,
    Building2: LucideIcons.Building2,
    MapPin: LucideIcons.MapPin,
    Clock: LucideIcons.Clock,
    Shield: LucideIcons.Shield,
    Users: LucideIcons.Users,
    Calendar: LucideIcons.Calendar,
    Package: LucideIcons.Package,
    Warehouse: LucideIcons.Warehouse,
    Globe: LucideIcons.Globe,
};
const getIcon = (name, fallback) => iconMap[name] || fallback;

export default function OurFleet() {
    const dispatch = useDispatch();
    const { fleets, activeFilter, fleetPageContent: fp, settings } = useSelector(state => state.transport);
    const isAuthenticated = localStorage.getItem('isAuth') === 'true';

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [newFleet, setNewFleet] = useState({
        name: '', cap: '', type: '', category: '', features: ''
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) { alert('Maximum file size is 5MB.'); return; }
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1000;
                let width = img.width, height = img.height;
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                setUploadPreview(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
        reader.readAsDataURL(file);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setUploadPreview(null);
        setImageFile(null);
        setEditingId(null);
        setNewFleet({ name: '', cap: '', type: '', category: '', features: '' });
    };

    const handleEditClick = (e, item) => {
        e.stopPropagation();
        setEditingId(item.id);
        setNewFleet({
            name: item.name || '',
            cap: item.cap || '',
            type: item.type || '',
            category: item.category || '',
            features: item.features || ''
        });
        setUploadPreview(item.image ? resolveImage(item.image) : null);
        setImageFile(null);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this fleet?")) return;

        try {
            const res = await fetch(`${API_URL}/fleet/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await res.json();
            if (data.status === 'success') {
                alert('Success: ' + data.message);
                dispatch(fetchAllData());
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('System error occurred: ' + error.message);
        }
    };

    const handleSubmitFleet = async () => {
        if (!editingId && (!uploadPreview || !newFleet.name || !newFleet.category)) {
            alert('Name, category, and image are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            let base64Data = null;
            let mimeType = null;
            if (uploadPreview && uploadPreview.startsWith('data:')) {
                const parts = uploadPreview.split(',');
                base64Data = parts[1];
                mimeType = parts[0].match(/:(.*?);/)[1];
            }

            const endpoint = editingId ? `${API_URL}/fleet/update` : `${API_URL}/fleet/add`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingId,
                    fileBase64: base64Data,
                    mimeType: mimeType,
                    fileName: imageFile ? imageFile.name : null,
                    ...newFleet
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                dispatch(fetchAllData());
                closeModal();
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            alert('Error: ' + err.message);
            setIsSubmitting(false);
        }
    };

    // Build unique categories dynamically from fleet data
    const allLabel = (settings?.filter_all || 'All');
    const dynamicCategories = [...new Set(fleets.map(f => f.category).filter(Boolean))];
    const categories = [allLabel, ...dynamicCategories];

    // Filter by category field (or show all)
    const filteredFleets = activeFilter === allLabel ? fleets : fleets.filter(f => f.category === activeFilter);

    // Fleet page text from spreadsheet
    const pageBadge = fp?.page_badge || '';
    const pageTitle = fp?.page_title || '';
    const pageHighlight = fp?.page_highlight || '';
    const pageDesc = fp?.page_desc || '';
    const useCasesTitle = fp?.usecases_title || '';
    const useCasesHighlight = fp?.usecases_highlight || '';
    const useCasesDesc = fp?.usecases_desc || '';
    const useCase1Title = fp?.usecase_1_title || '';
    const useCase1Desc = fp?.usecase_1_desc || '';
    const useCase2Title = fp?.usecase_2_title || '';
    const useCase2Desc = fp?.usecase_2_desc || '';
    const useCase3Title = fp?.usecase_3_title || '';
    const useCase3Desc = fp?.usecase_3_desc || '';
    const emptyText = fp?.empty_text || '';

    return (
        <div className="bg-[#0B0F19] min-h-screen font-sans pt-[60px] md:pt-[75px]">
            <section id="fleet" className="py-8 md:py-12 relative z-10 border-b border-white/5">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 border border-amber-500/30 rounded-full bg-amber-500/10">
                            <span className="text-amber-500 font-bold tracking-[0.2em] capitalize text-xs">{pageBadge.toLowerCase()}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic capitalize text-white tracking-tighter">{pageTitle.toLowerCase()} <span className="text-amber-500">{pageHighlight.toLowerCase()}</span></h1>
                        <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto">{pageDesc}</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-6 md:mb-8">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => dispatch(setFilter(cat))}
                                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] capitalize tracking-widest transition-all duration-300 border ${activeFilter === cat ? 'bg-amber-500 text-[#0B0F19] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'}`}>{cat.toLowerCase()}</button>
                        ))}
                    </div>
                    {isAuthenticated && (
                        <div className="flex justify-start mb-6">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-12 h-12 bg-[#b25712] rounded-lg flex items-center justify-center hover:bg-[#9a4a0f] transition-colors shadow-lg"
                                title="Add New Fleet"
                            >
                                <Plus size={24} className="text-white" />
                            </button>
                        </div>
                    )}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence mode='popLayout'>
                            {filteredFleets.filter(f => f.name).map((f) => {
                                const featuresArr = typeof f.features === 'string' ? f.features.split(',').map(s => s.trim()).filter(Boolean) : (f.features || []);
                                return (
                                    <motion.div key={f.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                                        <FleetCard {...f} f={f} features={featuresArr} img={resolveImage(f.image)} isAuthenticated={isAuthenticated} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                    {filteredFleets.filter(f => f.name).length === 0 && (<div className="text-center py-20 text-slate-400 italic">{emptyText}</div>)}
                </div>
            </section>

            <section className="py-16 md:py-24 relative overflow-hidden bg-[#080B13] border-b border-white/5">
                <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5_xl font-black italic capitalize text-white tracking-tighter mb-4">{useCasesTitle.toLowerCase()} <span className="text-amber-500">{useCasesHighlight.toLowerCase()}</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">{useCasesDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: getIcon(fp?.usecase_1_icon, LucideIcons.Briefcase), title: useCase1Title, desc: useCase1Desc },
                            { icon: getIcon(fp?.usecase_2_icon, LucideIcons.PlaneTakeoff), title: useCase2Title, desc: useCase2Desc },
                            { icon: getIcon(fp?.usecase_3_icon, LucideIcons.PackageOpen), title: useCase3Title, desc: useCase3Desc },
                        ].map((uc, i) => {
                            const Icon = uc.icon;
                            return (
                                <div key={i} className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] hover:border-amber-500/50 transition-colors group">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-[#0B0F19] transition-colors"><Icon size={32} /></div>
                                    <h3 className="text-2xl font-black italic text-white capitalize tracking-tight mb-4">{uc.title.toLowerCase()}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{uc.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Add Fleet Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-4xl max-h-[95vh] flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50/50">
                            <h2 className="text-[#1a202c] text-xl font-black italic tracking-tight">{editingId ? 'Edit' : 'Add New'} <span className="text-amber-500">Fleet</span></h2>
                            <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 p-6 lg:p-8 overflow-y-auto">
                            {/* Image Upload */}
                            <div className="w-full md:w-5/12 flex flex-col gap-2 shrink-0">
                                <label className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-amber-500 transition-all relative overflow-hidden group">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    {uploadPreview ? (
                                        <div className="w-full h-full relative p-2"><img src={uploadPreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-sm" /></div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 pointer-events-none group-hover:scale-110 transition-transform">
                                                <ImageIcon size={24} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <p className="text-gray-700 font-bold text-sm pointer-events-none">Select Fleet Photo</p>
                                            <p className="text-gray-400 text-xs mt-1">(Max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Form Fields */}
                            <div className="w-full md:w-7/12 flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">Fleet Name *</label>
                                    <input type="text" placeholder="e.g. Volvo 9900 VIP" value={newFleet.name} onChange={e => setNewFleet(p => ({ ...p, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a202c] focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">Category *</label>
                                        <input type="text" list="fleet-categories" placeholder="e.g. Bus" value={newFleet.category} onChange={e => setNewFleet(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a202c] focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
                                        <datalist id="fleet-categories">
                                            {dynamicCategories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">Type</label>
                                        <input type="text" placeholder="e.g. Executive Class" value={newFleet.type} onChange={e => setNewFleet(p => ({ ...p, type: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a202c] focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">Capacity</label>
                                    <input type="text" placeholder="e.g. 40 Seats" value={newFleet.cap} onChange={e => setNewFleet(p => ({ ...p, cap: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a202c] focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">Key Features</label>
                                    <textarea placeholder="Comma separated (e.g. Reclining Seats, WiFi, Toilet)" rows="2" value={newFleet.features} onChange={e => setNewFleet(p => ({ ...p, features: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a202c] focus:outline-none focus:border-amber-500 focus:bg-white transition-colors resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
                            <button onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleSubmitFleet} disabled={isSubmitting} className={`px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/30 hover:scale-105'}`}>{isSubmitting ? 'Uploading...' : 'Save Fleet'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}