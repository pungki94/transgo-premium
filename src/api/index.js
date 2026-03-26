const API_URL = 'http://localhost:5000/api';

const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
};

export const api = {
    getServices: () => fetchData('/services'),
    getFleets: () => fetchData('/fleets'),
    getSlides: () => fetchData('/slides'),
    getFeatures: () => fetchData('/features'),
    getTestimonials: () => fetchData('/testimonials'),
    getStats: () => fetchData('/stats'),
    getSteps: () => fetchData('/steps'),
    getCoverageAreas: () => fetchData('/coverage-areas')
};
