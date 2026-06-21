// Fallback mapping: old/incorrect spreadsheet filenames → correct local filenames
const imageAliases = {
    'bus-luxury.jpg': 'bus-fleet.jpg',
    'bus-executive.jpg': 'scania.jpg',
    'van-cargo.jpg': 'blind-van.png',
    'truck-wingbox.jpg': 'truck-fleet.png',
    'hiace.jpg': 'hiace-premio.png',
    'hiace-premio.jpg': 'hiace-premio.png',
};

// Eagerly resolve all fleet and hero assets into a dictionary map at build/dev time
const fleetImages = import.meta.glob('../assets/fleets/*.{jpg,jpeg,png,svg,webp}', { eager: true, import: 'default' });
const heroImages = import.meta.glob('../assets/hero/*.{jpg,jpeg,png,svg,webp}', { eager: true, import: 'default' });

const parseGoogleDriveUrl = (url) => {
    if (!url || !url.includes('drive.google.com')) return null;
    let fileId = '';
    try {
        const urlObj = new URL(url);
        fileId = urlObj.searchParams.get('id');
        if (!fileId && url.includes('/d/')) {
            fileId = url.split('/d/')[1].split('/')[0];
        }
    } catch (e) { }

    if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    return null;
};

export const resolveImage = (imgName) => {
    if (!imgName) return '';

    const driveUrl = parseGoogleDriveUrl(imgName);
    if (driveUrl) return driveUrl;

    if (imgName.startsWith('http')) return imgName;

    const resolved = imageAliases[imgName] || imgName;
    const match = Object.keys(fleetImages).find(path => path.endsWith(resolved));
    return match ? fleetImages[match] : '';
};

export const resolveSlideImage = (imgName) => {
    if (!imgName) return '';

    const driveUrl = parseGoogleDriveUrl(imgName);
    if (driveUrl) return driveUrl;

    if (imgName.startsWith('http')) return imgName;
    if (imgName.startsWith('/')) return imgName;

    const match = Object.keys(heroImages).find(path => path.endsWith(imgName));
    return match ? heroImages[match] : '';
};
