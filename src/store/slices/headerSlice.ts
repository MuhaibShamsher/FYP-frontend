import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type SectionKey } from '@/types';

interface HeaderState {
  activeSection: SectionKey;
}

const initialState: HeaderState = {
  activeSection: "dashboard",
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<SectionKey>) {
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection } = headerSlice.actions;
export default headerSlice.reducer;
