const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        // Suppress timeout/abort noise in console
        if (error.name !== 'TimeoutError' && error.name !== 'AbortError') {
            console.error(`Failed to fetch ${endpoint}:`, error);
        }
        throw error;
    }
};

export const api = {
    getCritical: () => fetchData('/critical'),
    getHero: () => fetchData('/hero'),
    getSettings: () => fetchData('/settings'),
    getSheet: (name) => fetchData(`/sheet/${name}`),
    getKV: (name) => fetchData(`/kv/${name}`),
    getGalleryFull: () => fetchData('/gallery-full'),
    getMeta: () => fetchData('/spreadsheet-meta'),
};
