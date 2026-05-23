// Fallback mapping: old/incorrect spreadsheet filenames → correct local filenames
const imageAliases = {
    'bus-luxury.jpg': 'bus-fleet.jpg',
    'bus-executive.jpg': 'scania.jpg',
    'van-cargo.jpg': 'blind-van.png',
    'truck-wingbox.jpg': 'truck-fleet.png',
    'hiace.jpg': 'hiace-premio.png',
    'hiace-premio.jpg': 'hiace-premio.png',
};

export const resolveImage = (imgName) => {
    if (!imgName) return '';
    if (imgName.startsWith('http')) return imgName;
    // Apply alias mapping for legacy/incorrect filenames
    const resolved = imageAliases[imgName] || imgName;
    // Dynamically resolve the image path using Vite's URL feature.
    // This eliminates the need for any hardcoded imports.
    try {
        return new URL(`../assets/fleets/${resolved}`, import.meta.url).href;
    } catch {
        return '';
    }
};

export const resolveSlideImage = (imgName) => {
    if (!imgName) return '';
    if (imgName.startsWith('http')) return imgName;
    return new URL(`../assets/hero/${imgName}`, import.meta.url).href;
};
