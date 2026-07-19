import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllData } from '../store';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { X, ZoomIn, Plus, Image as ImageIcon, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveImage } from '../utils/assets';

const cardSlideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : d < 0 ? '-100%' : 0, opacity: 0.5 }),
    center: { x: 0, opacity: 1, transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } } },
    exit: (d) => ({ x: d > 0 ? '-100%' : d < 0 ? '100%' : 0, opacity: 0.5, transition: { duration: 0.2 } }),
};

const lightboxSlideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : dir < 0 ? -300 : 0, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } } },
    exit: (dir) => ({ x: dir > 0 ? -300 : dir < 0 ? 300 : 0, opacity: 0, transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } } }),
};

function GalleryGroupCard({ group, onOpenLightbox, onEditClick, onDeleteClick }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dir, setDir] = useState(0);
    const dragActive = useRef(false);
    const dragX = useRef(0);
    const hasDragged = useRef(false);
    const images = group.images;
    const isMulti = images.length > 1;
    const active = images[currentSlide] || images[0];

    const goNext = useCallback(() => { if (!isMulti) return; setDir(1); setCurrentSlide(p => (p + 1) % images.length); }, [isMulti, images.length]);
    const goPrev = useCallback(() => { if (!isMulti) return; setDir(-1); setCurrentSlide(p => (p - 1 + images.length) % images.length); }, [isMulti, images.length]);
    const onDS = useCallback((x) => { dragActive.current = true; dragX.current = x; hasDragged.current = false; }, []);
    const onDE = useCallback((x) => {
        if (!dragActive.current) return; dragActive.current = false;
        const diff = dragX.current - x;
        if (Math.abs(diff) > 50) { hasDragged.current = true; diff > 0 ? goNext() : goPrev(); }
    }, [goNext, goPrev]);
    const handleCardClick = useCallback(() => { if (hasDragged.current) { hasDragged.current = false; return; } onOpenLightbox(images, currentSlide); }, [images, currentSlide, onOpenLightbox]);

    return (
        <div
            className={`group/card relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 ${isMulti ? 'cursor-grab active:cursor-grabbing select-none' : 'cursor-pointer'}`}
            onClick={handleCardClick}
            onMouseDown={isMulti ? (e) => { e.preventDefault(); onDS(e.clientX); } : undefined}
            onMouseUp={isMulti ? (e) => onDE(e.clientX) : undefined}
            onMouseLeave={isMulti ? (e) => { if (dragActive.current) onDE(e.clientX); } : undefined}
            onTouchStart={isMulti ? (e) => onDS(e.touches[0].clientX) : undefined}
            onTouchEnd={isMulti ? (e) => onDE(e.changedTouches[0].clientX) : undefined}
        >
            <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onEditClick(e, active); }} className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-amber-700 transition" title="Edit"><Pencil size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteClick(e, active.id); }} className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-700 transition" title="Delete"><Trash2 size={16} /></button>
            </div>

            {isMulti ? (
                <>
                    <AnimatePresence initial={false} custom={dir} mode="wait">
                        <motion.img key={active.src + currentSlide} src={active.src} alt={active.alt} className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" draggable={false} referrerPolicy="no-referrer" custom={dir} variants={cardSlideVariants} initial="enter" animate="center" exit="exit" onError={(e) => { e.target.style.display = 'none'; }} />
                    </AnimatePresence>
                    {images.map((img, i) => i !== currentSlide && (
                        <img key={'pl-' + img.id} src={img.src} alt="" className="hidden" loading="lazy" referrerPolicy="no-referrer" />
                    ))}
                </>
            ) : (
                <img src={active.src} alt={active.alt} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
            )}

            {isMulti && <div className="absolute top-2 left-2 bg-black/70 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold z-10 pointer-events-none flex items-center gap-1.5"><ImageIcon size={12} /> {currentSlide + 1} / {images.length}</div>}
            {isMulti && images.length <= 12 && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
                    {images.map((_, i) => <button key={i} onClick={(e) => { e.stopPropagation(); setDir(i > currentSlide ? 1 : -1); setCurrentSlide(i); }} className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-4 h-1.5 bg-amber-500' : 'w-1.5 h-1.5 bg-white/50'}`} />)}
                </div>
            )}
            {isMulti && (
                <>
                    <button className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-amber-500/80 flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); goPrev(); }}><ChevronLeft size={16} /></button>
                    <button className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 hover:bg-amber-500/80 flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); goNext(); }}><ChevronRight size={16} /></button>
                </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                        {active.caption && <p className="text-white font-bold text-sm md:text-base line-clamp-1 capitalize">{active.caption.toLowerCase()}</p>}
                        {active.tanggal && <span className="inline-block bg-amber-500 text-[#0B0F19] px-2 py-0.5 rounded text-[10px] font-bold mt-1.5 mb-1 mr-2">{active.tanggal}</span>}
                        {active.description && <p className="text-slate-300 text-[10px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed">{active.description}</p>}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0"><ZoomIn size={18} className="text-amber-500" /></div>
                </div>
            </div>
        </div>
    );
}

export default function Gallery() {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.transport.settings);
    const galleryContent = useSelector(state => state.transport.galleryContent) || {};
    const galleryItems = useSelector(state => state.transport.gallery) || [];
    const [lightboxGroup, setLightboxGroup] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uploadPreviews, setUploadPreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [editingId, setEditingId] = useState(null);
    const [fleetName, setFleetName] = useState('');
    const [description, setDescription] = useState('');
    const [judul, setJudul] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        let newFiles = editingId ? [selectedFiles[0]] : selectedFiles;

        // Filter only image files
        const imageFiles = newFiles.filter(f => ALLOWED_TYPES.includes(f.type));
        if (imageFiles.length < newFiles.length) {
            alert('Beberapa file bukan gambar dan telah diabaikan.');
        }
        newFiles = imageFiles;
        if (newFiles.length === 0) return;

        if (newFiles.length > 20) {
            alert('Maksimal upload 20 foto sekaligus.');
            newFiles = newFiles.slice(0, 20);
        }

        const totalSize = newFiles.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > 20 * 1024 * 1024) {
            alert('Total ukuran file melebihi 20MB.');
            return;
        }

        setFiles(newFiles);

        const previews = [];
        let processedCount = 0;

        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Optimize for speed and smaller payload
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                    previews.push({ dataUrl, name: file.name });
                    processedCount++;

                    if (processedCount === newFiles.length) {
                        setUploadPreviews(previews);
                    }
                };
            };
        });
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setUploadPreviews([]);
        setFiles([]);
        setUploadProgress({ current: 0, total: 0 });
        setEditingId(null);
        setFleetName('');
        setDescription('');
        setJudul('');
        setTanggal('');
    };

    const handleEditClick = (e, item) => {
        e.stopPropagation();
        setEditingId(item.id);
        setFleetName(item.fleetName || '');
        setDescription(item.description || '');
        setJudul(item.judul || '');
        setTanggal(item.tanggal || '');
        setUploadPreviews([{ dataUrl: item.src, name: 'current' }]);
        setFiles([]); // Clear files because they might not update image
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const res = await fetch(`${API_URL}/gallery/delete`, {
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

    const handleSubmitGallery = async () => {
        if (!editingId && files.length === 0) {
            alert('Please select an image first');
            return;
        }

        setIsSubmitting(true);

        try {
            const processSubmission = async (base64Data = null, mimeType = null, fileName = null, id = null) => {
                let decodedBase64 = null;
                if (base64Data) {
                    const parts = base64Data.split(',');
                    decodedBase64 = parts[1];
                    const mimeTypePart = parts[0].match(/:(.*?);/);
                    mimeType = mimeTypePart ? mimeTypePart[1] : 'image/jpeg';
                }

                const payload = {
                    fileName: fileName || '',
                    mimeType: mimeType || '',
                    fileBase64: decodedBase64,
                    fleetName: fleetName,
                    description: description,
                    judul: judul,
                    tanggal: tanggal,
                    id: id
                };

                const endpoint = id ? `${API_URL}/gallery/update` : `${API_URL}/gallery/add`;

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (data.status !== 'success') {
                    throw new Error(data.error || 'An error occurred.');
                }
            };

            if (editingId) {
                if (files.length > 0 && uploadPreviews.length > 0 && uploadPreviews[0].dataUrl.startsWith('data:')) {
                    await processSubmission(uploadPreviews[0].dataUrl, null, files[0].name, editingId);
                } else {
                    await processSubmission(null, null, null, editingId);
                }
            } else {
                setUploadProgress({ current: 0, total: uploadPreviews.length });
                for (let i = 0; i < uploadPreviews.length; i++) {
                    const preview = uploadPreviews[i];
                    await processSubmission(preview.dataUrl, null, preview.name, null);
                    setUploadProgress(prev => ({ ...prev, current: i + 1 }));
                }
            }

            closeModal();
            dispatch(fetchAllData());
        } catch (error) {
            alert('System error occurred: ' + error.message);
            setIsSubmitting(false);
            setUploadProgress({ current: 0, total: 0 });
        }
    };

    const uploadedGallery = galleryItems
        .filter(f => f.image)
        .map(f => ({
            id: f.id,
            src: resolveImage(f.image),
            alt: f['fleet name'] || 'Gallery Image',
            caption: f['judul'] || f['fleet name'] || '',
            fleetName: f['fleet name'] || '',
            judul: f['judul'] || '',
            tanggal: f['tanggal'] || '',
            description: f['description'] || ''
        }));

    // --- Group images by batch (same metadata = same upload batch) ---
    const groupedGallery = useMemo(() => {
        const groups = [];
        const map = new Map();
        uploadedGallery.forEach(img => {
            const key = `${img.judul}|${img.tanggal}|${img.fleetName}|${img.description}`;
            if (!map.has(key)) {
                const g = { ...img, images: [img] };
                map.set(key, g);
                groups.push(g);
            } else {
                map.get(key).images.push(img);
            }
        });
        return groups;
    }, [uploadedGallery]);

    // --- Lightbox slideshow logic (operates on a group's images) ---
    const isDragging = useRef(false);
    const dragStartX = useRef(0);

    const lightboxOpen = lightboxGroup !== null && lightboxGroup.length > 0;
    const lightboxImage = lightboxOpen ? lightboxGroup[lightboxIndex] : null;

    const openLightbox = useCallback((images, idx) => {
        setLightboxGroup(images);
        setLightboxIndex(idx);
        setSlideDirection(0);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxGroup(null);
        setLightboxIndex(0);
    }, []);

    const goLightboxPrev = useCallback(() => {
        if (!lightboxGroup || lightboxGroup.length <= 1) return;
        setSlideDirection(-1);
        setLightboxIndex(prev => (prev - 1 + lightboxGroup.length) % lightboxGroup.length);
    }, [lightboxGroup]);

    const goLightboxNext = useCallback(() => {
        if (!lightboxGroup || lightboxGroup.length <= 1) return;
        setSlideDirection(1);
        setLightboxIndex(prev => (prev + 1) % lightboxGroup.length);
    }, [lightboxGroup]);

    const handleLightboxDragStart = useCallback((clientX) => { isDragging.current = true; dragStartX.current = clientX; }, []);
    const handleLightboxDragEnd = useCallback((clientX) => {
        if (!isDragging.current) return; isDragging.current = false;
        const diff = dragStartX.current - clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? goLightboxNext() : goLightboxPrev(); }
    }, [goLightboxNext, goLightboxPrev]);
    const onLightboxMouseDown = useCallback((e) => { e.preventDefault(); handleLightboxDragStart(e.clientX); }, [handleLightboxDragStart]);
    const onLightboxMouseUp = useCallback((e) => { handleLightboxDragEnd(e.clientX); }, [handleLightboxDragEnd]);
    const onLightboxMouseLeave = useCallback((e) => { if (isDragging.current) handleLightboxDragEnd(e.clientX); }, [handleLightboxDragEnd]);
    const onLightboxTouchStart = useCallback((e) => { handleLightboxDragStart(e.touches[0].clientX); }, [handleLightboxDragStart]);
    const onLightboxTouchEnd = useCallback((e) => { handleLightboxDragEnd(e.changedTouches[0].clientX); }, [handleLightboxDragEnd]);

    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') goLightboxPrev();
            else if (e.key === 'ArrowRight') goLightboxNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen, closeLightbox, goLightboxPrev, goLightboxNext]);


    const galleryBadge = galleryContent?.gallery_badge || 'Memories';
    const galleryTitle = galleryContent?.gallery_title || 'Our';
    const galleryHighlight = galleryContent?.gallery_highlight || 'Gallery';
    const galleryDesc = galleryContent?.gallery_desc || 'Moment perjalanan luar biasa bersama para pelanggan kami.';
    const galleryEmpty = 'Belum ada foto galeri.';
    const modalAdd = 'Add New Photo';
    const modalEdit = 'Edit Photo';
    const modalCancel = 'Cancel';
    const modalSave = 'Save Changes';
    const modalAddBtn = 'Upload Photo';

    return (
        <section className="min-h-screen bg-[#0B0F19] pt-[100px] md:pt-[130px] pb-16 md:pb-24 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 border border-amber-500/30 rounded-full bg-amber-500/10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] capitalize text-xs">{galleryBadge.toLowerCase()}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5_xl font-black italic capitalize text-white tracking-tighter leading-none">
                        {galleryTitle.toLowerCase()} <span className="text-amber-500">{galleryHighlight.toLowerCase()}</span>
                    </h1>
                    <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto">
                        {galleryDesc}
                    </p>
                </div>

                {/* Add Button */}
                <div className="flex justify-start mb-6">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-12 h-12 bg-[#b25712] rounded-lg flex items-center justify-center hover:bg-[#9a4a0f] transition-colors shadow-lg"
                    >
                        <Plus size={24} className="text-white" />
                    </button>
                </div>

                {/* Gallery Grid */}
                {groupedGallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {groupedGallery.map((group, idx) => (
                            <GalleryGroupCard
                                key={`${group.judul}-${group.tanggal}-${idx}`}
                                group={group}
                                onOpenLightbox={openLightbox}
                                onEditClick={handleEditClick}
                                onDeleteClick={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">{galleryEmpty}</p>
                    </div>
                )}
            </div>

            {/* Lightbox Slideshow Modal */}
            {lightboxOpen && lightboxImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none"
                >
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
                        onClick={closeLightbox}
                    ></div>

                    <div
                        className="relative w-full max-w-4xl bg-[#080B13] rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden border border-white/10 z-10 flex flex-col max-h-[95vh] md:max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-[#0B0F19]/60 hover:bg-amber-500 text-white hover:text-[#0B0F19] rounded-full flex items-center justify-center transition-colors z-[100] backdrop-blur-md border border-white/20 hover:border-transparent"
                        >
                            <X size={20} />
                        </button>

                        {/* TOP SIDE: Image area with swipe */}
                        <div
                            className="w-full h-[35vh] md:h-[45vh] shrink-0 relative overflow-hidden bg-black/90 flex items-center justify-center group cursor-grab active:cursor-grabbing"
                            onMouseDown={onLightboxMouseDown}
                            onMouseUp={onLightboxMouseUp}
                            onMouseLeave={onLightboxMouseLeave}
                            onTouchStart={onLightboxTouchStart}
                            onTouchEnd={onLightboxTouchEnd}
                        >
                            {/* Counter */}
                            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-bold tracking-wider border border-white/20">
                                {lightboxIndex + 1} / {lightboxGroup.length}
                            </div>

                            {/* Prev arrow */}
                            {lightboxGroup.length > 1 && (
                                <button
                                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-[#0B0F19] flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 border border-white/10 hover:border-transparent"
                                    onClick={(e) => { e.stopPropagation(); goLightboxPrev(); }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            {/* Next arrow */}
                            {lightboxGroup.length > 1 && (
                                <button
                                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-[#0B0F19] flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 border border-white/10 hover:border-transparent"
                                    onClick={(e) => { e.stopPropagation(); goLightboxNext(); }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}

                            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                                <motion.img
                                    key={lightboxImage.src + lightboxIndex}
                                    src={lightboxImage.src}
                                    alt={lightboxImage.alt}
                                    className="w-full h-full object-cover pointer-events-none"
                                    referrerPolicy="no-referrer"
                                    draggable={false}
                                    custom={slideDirection}
                                    variants={lightboxSlideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </AnimatePresence>

                            {/* Dot indicators */}
                            {lightboxGroup.length > 1 && (
                                <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
                                    {lightboxGroup.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSlideDirection(i > lightboxIndex ? 1 : -1); setLightboxIndex(i); }}
                                            className={`rounded-full transition-all duration-300 ${i === lightboxIndex
                                                ? 'w-6 h-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                                : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* BOTTOM SIDE: Info area */}
                        <div className="w-full p-6 pb-12 md:p-10 lg:px-16 overflow-y-auto custom-scrollbar flex flex-col items-center text-center bg-[#080B13] min-h-[30vh]">
                            {lightboxImage.tanggal && (
                                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-md text-[10px] font-black capitalize mb-3 italic block mx-auto">
                                    {lightboxImage.tanggal}
                                </span>
                            )}
                            <h3 className="text-2xl lg:text-3xl font-black capitalize italic mb-1.5 tracking-tight text-white">
                                {lightboxImage.caption?.toLowerCase() || 'gallery image'}
                            </h3>
                            <p className="text-amber-500 font-bold capitalize tracking-widest text-xs mb-6">
                                {lightboxImage.fleetName?.toLowerCase() || 'transelite fleet'}
                            </p>

                            {lightboxImage.description && (
                                <div className="mb-2 max-w-2xl mx-auto flex flex-col items-center">
                                    <h4 className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 text-white font-bold capitalize tracking-widest text-[10px]">
                                        Description
                                    </h4>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        {lightboxImage.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-[#1a202c] text-lg font-bold">{editingId ? modalEdit : modalAdd}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col md:flex-row gap-6 p-5 overflow-y-auto">
                            {/* Left: Upload Area */}
                            <div className="w-full md:w-5/12 shrink-0 flex flex-col gap-2">
                                <label className="w-full h-48 md:h-full md:min-h-[240px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple={!editingId}
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {uploadPreviews.length > 0 ? (
                                        <div className="w-full h-full relative p-0 bg-transparent">
                                            {uploadPreviews.length === 1 ? (
                                                <img src={uploadPreviews[0].dataUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full p-2 grid grid-cols-3 gap-2 overflow-y-auto mix-blend-multiply bg-gray-50 content-start">
                                                    {uploadPreviews.map((p, i) => (
                                                        <div key={i} className="aspect-square rounded-md overflow-hidden shadow-sm bg-white border border-gray-200">
                                                            <img src={p.dataUrl} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {uploadPreviews.length > 1 && (
                                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-bold pointer-events-none z-10 shadow-sm">
                                                    {uploadPreviews.length} / 20
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 pointer-events-none group-hover:scale-110 transition-transform">
                                                <ImageIcon size={20} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-bold text-sm pointer-events-none">Click to upload</p>
                                            <p className="text-gray-400 text-xs mt-1 pointer-events-none text-center px-4">
                                                {editingId ? "or select from device" : "Max 20 photos (Total max 20MB)"}
                                            </p>
                                        </>
                                    )}
                                </label>
                                {uploadProgress.total > 1 && uploadProgress.current > 0 && (
                                    <div className="w-full">
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#b25712] h-2 rounded-full transition-all duration-300" style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-[10px] text-gray-500 font-medium">Uploading {uploadProgress.current} of {uploadProgress.total}...</p>
                                            <p className="text-[10px] text-gray-400">{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Form Fields */}
                            <div className="w-full md:w-7/12 flex flex-col gap-3.5">
                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-1">Fleet Name:</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Toyota Hiace Premio"
                                        value={fleetName}
                                        onChange={(e) => setFleetName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-1">Description:</label>
                                    <textarea
                                        placeholder="Describe the capacity, features, and comfort..."
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712] resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Judul:</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Tour Bandung"
                                            value={judul}
                                            onChange={(e) => setJudul(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Tanggal:</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 09/12/2025"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 rounded-lg border border-[#f5ebdb] text-[#b25712] text-sm font-bold hover:bg-[#faeedd] transition-colors"
                            >
                                {modalCancel}
                            </button>
                            <button
                                onClick={handleSubmitGallery}
                                disabled={isSubmitting}
                                className={`px-5 py-2 rounded-lg text-white text-sm font-bold shadow-md transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b25712] hover:bg-[#9a4a0f]'
                                    }`}
                            >
                                {isSubmitting ? (editingId ? 'Saving...' : 'Uploading...') : (editingId ? modalSave : modalAddBtn)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
