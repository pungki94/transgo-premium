import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const fetchAllData = createAsyncThunk('transport/fetchAllData', async () => {
    const [services, fleets, slides, features, testimonials, stats, steps, coverageAreas] = await Promise.all([
        api.getServices(),
        api.getFleets(),
        api.getSlides(),
        api.getFeatures(),
        api.getTestimonials(),
        api.getStats(),
        api.getSteps(),
        api.getCoverageAreas()
    ]);
    return { services, fleets, slides, features, testimonials, stats, steps, coverageAreas };
});

const transportSlice = createSlice({
    name: 'transport',
    initialState: {
        activeFilter: 'All',
        loading: false,
        error: null,
        services: [],
        fleets: [],
        slides: [],
        features: [],
        testimonials: [],
        stats: null,
        steps: [],
        coverageAreas: []
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
            Object.assign(state, action.payload);
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