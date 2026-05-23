import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { parseList, parseSimpleList } from '../utils/sheetParser';

export const fetchAllData = createAsyncThunk('transport/fetchAllData', async () => {
    const results = await Promise.allSettled([
        api.getSettings(),     // 0
        api.getSheet('hero'),  // 1 (slides)
        api.getKV('home'),     // 2
        api.getKV('about'),    // 3
        api.getKV('services'), // 4
        api.getKV('fleet'),    // 5 (page content + vehicle data)
        api.getKV('contact'),  // 6
    ]);

    const get = (idx, fallback) => {
        if (results[idx].status === 'fulfilled' && results[idx].value) return results[idx].value;
        return fallback;
    };

    const settings = get(0, {});
    const heroSlides = Array.isArray(get(1, [])) ? get(1, []) : [];
    const homeKV = (typeof get(2, {}) === 'object' && !Array.isArray(get(2, {}))) ? get(2, {}) : {};
    const aboutKV = (typeof get(3, {}) === 'object' && !Array.isArray(get(3, {}))) ? get(3, {}) : {};
    const servicesKV = (typeof get(4, {}) === 'object' && !Array.isArray(get(4, {}))) ? get(4, {}) : {};
    const fleetKV = (typeof get(5, {}) === 'object' && !Array.isArray(get(5, {}))) ? get(5, {}) : {};
    const contactKV = (typeof get(6, {}) === 'object' && !Array.isArray(get(6, {}))) ? get(6, {}) : {};

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
        settings,
        slides: heroSlides.length > 0 ? heroSlides : null,
        homeContent: Object.keys(homeKV).length > 0 ? homeKV : null,
        aboutContent: Object.keys(aboutKV).length > 0 ? aboutKV : null,
        servicesPageContent: Object.keys(servicesKV).length > 0 ? servicesKV : null,
        fleetPageContent: Object.keys(fleetKV).length > 0 ? fleetKV : null,
        contact: Object.keys(contactKV).length > 0 ? contactKV : null,
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
        settings: {},
        slides: [],
        // All data from spreadsheet — no local fallbacks
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
        homeContent: {},
        aboutContent: {},
        servicesPageContent: {},
        fleetPageContent: {},
        contact: {},
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
            // Always update state with fresh data from spreadsheet
            state.fleets = p.fleets || state.fleets;
            state.settings = Object.keys(p.settings).length > 0 ? p.settings : state.settings;
            state.slides = p.slides || state.slides;
            state.services = p.services || state.services;
            state.servicesContent = p.servicesContent || state.servicesContent;
            state.features = p.features || state.features;
            state.featuresContent = p.featuresContent || state.featuresContent;
            state.steps = p.steps || state.steps;
            state.stepsContent = p.stepsContent || state.stepsContent;
            state.stats = p.stats || state.stats;
            state.statsContent = p.statsContent || state.statsContent;
            state.testimonials = p.testimonials || state.testimonials;
            state.testimonialsContent = p.testimonialsContent || state.testimonialsContent;
            state.coverageAreas = p.coverageAreas || state.coverageAreas;
            state.coverageContent = p.coverageContent || state.coverageContent;
            state.homeContent = p.homeContent || state.homeContent;
            state.aboutContent = p.aboutContent || state.aboutContent;
            state.servicesPageContent = p.servicesPageContent || state.servicesPageContent;
            state.fleetPageContent = p.fleetPageContent || state.fleetPageContent;
            state.contact = p.contact || state.contact;
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