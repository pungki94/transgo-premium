import * as Icons from 'lucide-react';

// Map common aliases (Indonesian & English) to lucide-react icon names
const ICON_ALIASES = {
    // Indonesian aliases
    'Pesawat': 'Plane',
    'Bis': 'Bus',
    'Mobil': 'Car',
    'Truk': 'Truck',
    'Kapal': 'Ship',
    'Kereta': 'Train',
    'Sepeda': 'Bike',
    'Motor': 'Bike',
    'Helikopter': 'Helicopter',
    'Taksi': 'CarTaxiFront',
    'Ambulans': 'Ambulance',
    // Direct English names also work (passthrough)
};

export const renderIcon = (iconName, props = {}) => {
    if (!iconName) return null;
    // Check alias mapping first, then try direct name
    const resolvedName = ICON_ALIASES[iconName] || iconName;
    const IconComponent = Icons[resolvedName];
    return IconComponent ? <IconComponent {...props} /> : null;
};
