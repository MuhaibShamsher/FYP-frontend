import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ActiveIdsState {
  scanId: string | null;
  riskAssessmentId: string | null;
  complianceId: string | null;
}

const initialState: ActiveIdsState = {
  scanId: null,
  riskAssessmentId: null,
  complianceId: null,
};

const activeIdsSlice = createSlice({
  name: 'activeIds',
  initialState,
  reducers: {
    setActiveScanId: (state, action: PayloadAction<string>) => {
      state.scanId = action.payload;
    },
    setActiveRiskAssessmentId: (state, action: PayloadAction<string>) => {
      state.riskAssessmentId = action.payload;
    },
    setActiveComplianceId: (state, action: PayloadAction<string>) => {
      state.complianceId = action.payload;
    },
    clearActiveIds: (state) => {
      state.scanId = null;
      state.riskAssessmentId = null;
      state.complianceId = null;
    },
  },
});

export const {
  setActiveScanId,
  setActiveRiskAssessmentId,
  setActiveComplianceId,
  clearActiveIds,
} = activeIdsSlice.actions;

export default activeIdsSlice.reducer;
