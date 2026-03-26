export const resolveImage = (imgName) => {
    if (!imgName) return '';
    if (imgName.startsWith('http')) return imgName;
    
    // Dynamically resolve the image path using Vite's URL feature.
    // This eliminates the need for any hardcoded imports.
    return new URL(`../assets/fleets/${imgName}`, import.meta.url).href;
};
