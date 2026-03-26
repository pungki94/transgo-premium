import * as Icons from 'lucide-react';

export const renderIcon = (iconName, props = {}) => {
    if (!iconName) return null;
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent {...props} /> : null;
};
