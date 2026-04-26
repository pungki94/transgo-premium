import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const fetchAllData = createAsyncThunk('transport/fetchAllData', async () => {
    const results = await Promise.allSettled([
        api.getFleets(),
        api.getSettings()
    ]);
    const getValue = (idx, fallback) => results[idx].status === 'fulfilled' ? results[idx].value : fallback;
    return {
        fleets: getValue(0, []),
        settings: getValue(1, {})
    };
});

const loadFromCache = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

const transportSlice = createSlice({
    name: 'transport',
    initialState: {
        activeFilter: 'All',
        loading: false,
        error: null,
        fleets: loadFromCache('transgo_fleets', []),
        settings: { brand_name_1: 'TRANS', brand_name_2: 'ELITE' }
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
            state.fleets = action.payload.fleets;
            // Settings always use fresh API data (no merge with stale cache)
            if (Object.keys(action.payload.settings).length > 0) {
                state.settings = action.payload.settings;
            }
            
            // Cache to local storage (fleets only, settings are always fresh)
            try {
                localStorage.setItem('transgo_fleets', JSON.stringify(action.payload.fleets));
            } catch (error) {
                console.error("Could not save to localStorage", error);
            }
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