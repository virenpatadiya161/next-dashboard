import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { search: '' },
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload; },
  },
});

export const { setSearch } = uiSlice.actions;
// A new store for each mounted Provider, not a shared server singleton.
export const makeStore = () => configureStore({ reducer: { ui: uiSlice.reducer } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
