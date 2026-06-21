import { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, ZoomIn, Plus, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { resolveImage } from '../utils/assets';

export default function Gallery() {
    const settings = useSelector(state => state.transport.settings);
    const galleryContent = useSelector(state => state.transport.galleryContent) || {};
    const galleryItems = useSelector(state => state.transport.gallery) || [];
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [fleetName, setFleetName] = useState('');
    const [description, setDescription] = useState('');
    const [judul, setJudul] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Keep the file name for submission
            setFile(selectedFile);

            // Compress image
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
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

                    // Compress to JPEG with 0.6 quality for faster upload
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                    setUploadPreview(dataUrl);
                };
            };
        }
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setUploadPreview(null);
        setFile(null);
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
        setUploadPreview(item.src);
        setFile(null); // Clear file because they might not update image
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const res = await fetch('http://localhost:5000/api/gallery/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await res.json();
            if (data.status === 'success') {
                alert('Success: ' + data.message);
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('System error occurred: ' + error.message);
        }
    };

    const handleSubmitGallery = async () => {
        // Only require file if it's a new upload (not editing) OR if they are editing and decided to change picture.
        if (!editingId && !file) {
            alert('Please select an image first');
            return;
        }

        setIsSubmitting(true);

        try {
            // Read file as base64
            const processSubmission = async (base64Data = null, mimeType = null, fileName = null) => {
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
                    id: editingId // Include ID if editing
                };

                const endpoint = editingId ? 'http://localhost:5000/api/gallery/update' : 'http://localhost:5000/api/gallery/add';

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (data.status === 'success') {
                    // Close modal immediately and reload cleanly without blocking alert
                    closeModal();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'An error occurred.'));
                }
                setIsSubmitting(false);
            };

            if (file && uploadPreview && uploadPreview.startsWith('data:')) {
                // If they uploaded a new file, we use the compressed base64 from `uploadPreview`
                await processSubmission(uploadPreview, null, file.name);
            } else {
                // Edit without changing image (uploadPreview is just URL or same string)
                await processSubmission();
            }
        } catch (error) {
            alert('System error occurred: ' + error.message);
            setIsSubmitting(false);
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

    const galleryImages = uploadedGallery;


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
                {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {galleryImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/30 transition-all duration-500"
                                onClick={() => setSelectedImage(img)}
                            >
                                <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleEditClick(e, img)}
                                        className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-amber-700 transition"
                                        title="Edit Image"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, img.id)}
                                        className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-700 transition"
                                        title="Delete Image"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-2">
                                            {img.caption && (
                                                <p className="text-white font-bold text-sm md:text-base line-clamp-1 capitalize">{img.caption.toLowerCase()}</p>
                                            )}
                                            {img.tanggal && (
                                                <span className="inline-block bg-amber-500 text-[#0B0F19] px-2 py-0.5 rounded text-[10px] font-bold mt-1.5 mb-1 mr-2">{img.tanggal}</span>
                                            )}
                                            {img.description && (
                                                <p className="text-slate-300 text-[10px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed">{img.description}</p>
                                            )}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
                                            <ZoomIn size={18} className="text-amber-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">{galleryEmpty}</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={20} />
                    </button>
                    <div className="max-w-4xl max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="max-w-full max-h-[80vh] object-contain rounded-xl"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {selectedImage.caption && (
                            <div className="text-center mt-4 bg-[#0B0F19]/80 p-4 md:p-6 rounded-xl border border-white/10 max-w-2xl mx-auto shadow-xl">
                                <p className="text-white font-black text-xl md:text-2xl italic capitalize">{selectedImage.caption.toLowerCase()}</p>
                                <div className="flex items-center justify-center gap-3 mt-3">
                                    {selectedImage.tanggal && (
                                        <span className="bg-amber-500 text-[#0B0F19] px-3 py-1 rounded-md text-xs font-bold">{selectedImage.tanggal}</span>
                                    )}
                                </div>
                                {selectedImage.description && (
                                    <p className="text-slate-300 text-xs md:text-sm mt-4 italic leading-relaxed">
                                        "{selectedImage.description}"
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add New Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-[#1a202c] text-xl font-bold">{editingId ? modalEdit : modalAdd}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
                            {/* Left: Upload Area */}
                            <div className="w-full md:w-1/2">
                                <label className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {uploadPreview ? (
                                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 pointer-events-none">
                                                <ImageIcon size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-bold text-sm pointer-events-none">Click to upload</p>
                                            <p className="text-gray-400 text-xs mt-1 pointer-events-none">or select from device</p>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Right: Form Fields */}
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Fleet Name:</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Toyota Hiace Premio"
                                        value={fleetName}
                                        onChange={(e) => setFleetName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description:</label>
                                    <textarea
                                        placeholder="Describe the capacity, features, and comfort..."
                                        rows="4"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712] resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Judul:</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Tour Bandung"
                                            value={judul}
                                            onChange={(e) => setJudul(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal:</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 09/12/2025"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none focus:border-[#b25712] focus:ring-1 focus:ring-[#b25712]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2.5 rounded-lg border border-[#f5ebdb] text-[#b25712] font-bold hover:bg-[#faeedd] transition-colors"
                            >
                                {modalCancel}
                            </button>
                            <button
                                onClick={handleSubmitGallery}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 rounded-lg text-white font-bold shadow-md transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b25712] hover:bg-[#9a4a0f]'
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
