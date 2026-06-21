import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { parseList, parseSimpleList } from '../utils/sheetParser';

export const fetchAllData = createAsyncThunk('transport/fetchAllData', async () => {
    const results = await Promise.allSettled([
        api.getCritical(),     // 0 (settings + hero)
        api.getKV('Home'),     // 1
        api.getKV('About Us'), // 2
        api.getKV('Services'), // 3
        api.getKV('Fleet'),    // 4 (page content + vehicle data)
        api.getKV('Contact'),  // 5
        api.getGalleryFull(),  // 6 (gallery page meta + items)
        api.getMeta(),         // 7 (list of all sheets)
    ]);

    const get = (idx, fallback) => {
        if (results[idx].status === 'fulfilled' && results[idx].value) return results[idx].value;
        return fallback;
    };

    const criticalData = get(0, { settings: {}, hero: [] });
    const settings = criticalData.settings;
    const heroSlidesRaw = Array.isArray(criticalData.hero) ? criticalData.hero : [];
    // Filter out empty rows and non-slide config rows (e.g. hero_badge, hero_title_1)
    const heroSlides = heroSlidesRaw.filter(s => s.id && s.image);
    const homeKV = (typeof get(1, {}) === 'object' && !Array.isArray(get(1, {}))) ? get(1, {}) : {};
    const aboutKV = (typeof get(2, {}) === 'object' && !Array.isArray(get(2, {}))) ? get(2, {}) : {};
    const servicesKV = (typeof get(3, {}) === 'object' && !Array.isArray(get(3, {}))) ? get(3, {}) : {};
    const fleetKV = (typeof get(4, {}) === 'object' && !Array.isArray(get(4, {}))) ? get(4, {}) : {};
    const contactKV = (typeof get(5, {}) === 'object' && !Array.isArray(get(5, {}))) ? get(5, {}) : {};
    const galleryFull = get(6, { meta: {}, items: [] });
    const galleryContent = galleryFull.meta || {};
    const galleryItems = Array.isArray(galleryFull.items) ? galleryFull.items : [];
    const meta = get(7, { sheets: [] });

    // Identify dynamic page sheets (sheets that aren't core or config sheets)
    // Any sheet NOT in this list will automatically appear as a dynamic page + menu item
    const CORE_SHEETS = ['settings', 'hero', 'home', 'about us', 'services', 'fleet', 'contact', 'gallery', 'fleets', 'users'];
    const dynamicPages = (meta.sheets || [])
        .filter(s => !CORE_SHEETS.includes(s.toLowerCase()))
        .map(s => ({
            name: s,
            path: `/${s.toLowerCase().replace(/\s+/g, '-')}`,
            sheetName: s
        }));

    // Parse array data from home KV sheet (only Home page content)
    const steps = parseList(homeKV, 'step', ['step', 'title', 'desc', 'icon']);
    const statsContent = parseList(homeKV, 'stat', ['key', 'label', 'icon']);
    const testimonials = parseList(homeKV, 'testimonial', ['review', 'name', 'role']);

    // Parse services & features from services KV sheet (with fallback to home KV for migration)
    const services = parseList(servicesKV, 'service', ['id', 'title', 'desc', 'icon']).length > 0
        ? parseList(servicesKV, 'service', ['id', 'title', 'desc', 'icon'])
        : parseList(homeKV, 'service', ['id', 'title', 'desc', 'icon']);
    const features = parseList(servicesKV, 'feature', ['icon', 'title', 'desc']).length > 0
        ? parseList(servicesKV, 'feature', ['icon', 'title', 'desc'])
        : parseList(homeKV, 'feature', ['icon', 'title', 'desc']);

    // Parse coverage areas from services KV sheet
    const coverageAreas = parseSimpleList(servicesKV, 'coverage');

    // Parse vehicle data from fleet KV sheet
    const fleets = parseList(fleetKV, 'vehicle', ['id', 'image', 'alt', 'name', 'cap', 'type', 'category', 'features']);

    // Parse stats values from home KV
    const stats = {};
    if (homeKV.stats_trips) stats.trips = homeKV.stats_trips;
    if (homeKV.stats_clients) stats.clients = homeKV.stats_clients;
    if (homeKV.stats_ontime) stats.onTime = homeKV.stats_ontime;
    if (homeKV.stats_fleetunits) stats.fleetUnits = homeKV.stats_fleetunits;

    // Services content: prefer services sheet, fallback to home sheet
    const svcBadgeSrc = servicesKV.services_badge ? servicesKV : homeKV;
    const featBadgeSrc = servicesKV.features_badge ? servicesKV : homeKV;

    return {
        fleets: fleets.length > 0 ? fleets : null,
        gallery: galleryItems.length > 0 ? galleryItems : null,
        galleryContent: Object.keys(galleryContent).length > 0 ? galleryContent : null,
        settings,
        slides: heroSlides.length > 0 ? heroSlides : null,
        homeContent: Object.keys(homeKV).length > 0 ? homeKV : null,
        aboutContent: Object.keys(aboutKV).length > 0 ? aboutKV : null,
        servicesPageContent: Object.keys(servicesKV).length > 0 ? servicesKV : null,
        fleetPageContent: Object.keys(fleetKV).length > 0 ? fleetKV : null,
        contact: Object.keys(contactKV).length > 0 ? contactKV : null,
        // Dynamic pages list
        dynamicPages,
        // Parsed arrays (null if empty = use fallback)
        services: services.length > 0 ? services : null,
        servicesContent: svcBadgeSrc.services_badge ? {
            badge: svcBadgeSrc.services_badge, title: svcBadgeSrc.services_title, highlight: svcBadgeSrc.services_highlight
        } : null,
        features: features.length > 0 ? features : null,
        featuresContent: featBadgeSrc.features_badge ? {
            badge: featBadgeSrc.features_badge, title: featBadgeSrc.features_title,
            highlight: featBadgeSrc.features_highlight, suffix: featBadgeSrc.features_suffix, desc: featBadgeSrc.features_desc
        } : null,
        steps: steps.length > 0 ? steps : null,
        stepsContent: homeKV.steps_badge ? {
            badge: homeKV.steps_badge, title: homeKV.steps_title,
            highlight: homeKV.steps_highlight, stepPrefix: homeKV.steps_prefix
        } : null,
        stats: Object.keys(stats).length > 0 ? stats : null,
        statsContent: statsContent.length > 0 ? statsContent : null,
        testimonials: testimonials.length > 0 ? testimonials : null,
        testimonialsContent: homeKV.testimonials_badge ? {
            badge: homeKV.testimonials_badge, title: homeKV.testimonials_title, highlight: homeKV.testimonials_highlight
        } : null,
        coverageAreas: coverageAreas.length > 0 ? coverageAreas.map(a => ({ area: a })) : null,
        coverageContent: servicesKV.coverage_title ? {
            title: servicesKV.coverage_title, highlight: servicesKV.coverage_highlight, desc: servicesKV.coverage_desc
        } : null,
    };
});


const transportSlice = createSlice({
    name: 'transport',
    initialState: {
        activeFilter: 'All',
        loading: false,
        error: null,
        fleets: [],
        gallery: [],
        galleryContent: {},
        settings: {
            brand_name_1: "Transgo",
            brand_name_2: " Premium",
            brand_icon: "bus",
            brand_text_color_1: "#ffffff",
            brand_text_color_2: "#f59e0b",
            brand_icon_color: "#f59e0b",
            menu_home: "Home",
            menu_about: "About Us",
            menu_services: "Services",
            menu_fleet: "Fleet",
            menu_contact: "Contact",
            menu_gallery: "Gallery"
        },
        slides: [{
            id: 'fallback1',
            image: "/bus-fleet.jpg",
            alt: "Premium Fleet",
            stat: "10+",
            statLabel: "Years\nExperience",
            badge: "Premium Transport"
        }],
        // All data from spreadsheet — no local fallbacks needed for all, but some for LCP
        services: [],
        servicesContent: {},
        features: [],
        featuresContent: {},
        steps: [],
        stepsContent: {},
        stats: {},
        statsContent: [],
        testimonials: [],
        testimonialsContent: {},
        coverageAreas: [],
        coverageContent: {},
        // Page-specific content
        homeContent: {
            hero_badge: "TransGo Premium",
            hero_title_1: "Elite",
            hero_title_2: "Transport",
            hero_title_3: "Services",
            hero_desc: "Loading latest data...",
            hero_cta_1: "View Fleet",
            hero_cta_2: "Contact Us",
            hero_feature_1: "Safe",
            hero_feature_2: "On Time",
            hero_feature_3: "Comfortable",
            features_floating_title: "Premium Fleet",
            features_floating_desc: "Luxury comfort"
        },
        aboutContent: {},
        servicesPageContent: {},
        fleetPageContent: {},
        contact: {},
        dynamicPages: [],
    },
    reducers: {
        setFilter: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllData.fulfilled, (state, action) => {
            state.loading = false;
            const p = action.payload;
            // Always update state with fresh data from spreadsheet, but ONLY if it actually exists.
            // This prevents the instant fallback UI from being wiped out by an empty network response.
            if (p.fleets) state.fleets = p.fleets;
            if (p.gallery) state.gallery = p.gallery;
            if (p.galleryContent && Object.keys(p.galleryContent).length > 0) state.galleryContent = p.galleryContent;
            if (p.settings && Object.keys(p.settings).length > 0) state.settings = p.settings;
            if (p.slides) state.slides = p.slides;
            if (p.services) state.services = p.services;
            if (p.servicesContent && Object.keys(p.servicesContent).length > 0) state.servicesContent = p.servicesContent;
            if (p.features) state.features = p.features;
            if (p.featuresContent && Object.keys(p.featuresContent).length > 0) state.featuresContent = p.featuresContent;
            if (p.steps) state.steps = p.steps;
            if (p.stepsContent && Object.keys(p.stepsContent).length > 0) state.stepsContent = p.stepsContent;
            if (p.stats) state.stats = p.stats;
            if (p.statsContent) state.statsContent = p.statsContent;
            if (p.testimonials) state.testimonials = p.testimonials;
            if (p.testimonialsContent && Object.keys(p.testimonialsContent).length > 0) state.testimonialsContent = p.testimonialsContent;
            if (p.coverageAreas) state.coverageAreas = p.coverageAreas;
            if (p.coverageContent && Object.keys(p.coverageContent).length > 0) state.coverageContent = p.coverageContent;
            if (p.homeContent && Object.keys(p.homeContent).length > 0) state.homeContent = p.homeContent;
            if (p.aboutContent && Object.keys(p.aboutContent).length > 0) state.aboutContent = p.aboutContent;
            if (p.servicesPageContent && Object.keys(p.servicesPageContent).length > 0) state.servicesPageContent = p.servicesPageContent;
            if (p.fleetPageContent && Object.keys(p.fleetPageContent).length > 0) state.fleetPageContent = p.fleetPageContent;
            if (p.contact && Object.keys(p.contact).length > 0) state.contact = p.contact;
            if (p.dynamicPages) state.dynamicPages = p.dynamicPages;
        });
        builder.addCase(fetchAllData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export const { setFilter } = transportSlice.actions;
export const store = configureStore({
    reducer: { transport: transportSlice.reducer }
});