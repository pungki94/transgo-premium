import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const fetchAllData = createAsyncThunk('transport/fetchAllData', async () => {
    const results = await Promise.allSettled([
        api.getFleets()
    ]);
    const getValue = (idx, fallback) => results[idx].status === 'fulfilled' ? results[idx].value : fallback;
    return {
        fleets: getValue(0, [])
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
        fleets: loadFromCache('transgo_fleets', [])
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
            
            // Cache to local storage
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