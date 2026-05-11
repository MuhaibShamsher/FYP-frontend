import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ActiveIdsState {
  scanId: string | null;
  riskAssessmentId: string | null;
  complianceId: string | null;
  isPipelineActive: boolean;
}

const initialState: ActiveIdsState = {
  scanId: null,
  riskAssessmentId: null,
  complianceId: null,
  isPipelineActive: false,
};

const activeIdsSlice = createSlice({
  name: 'activeIds',
  initialState,
  reducers: {
    setActiveScanId: (state, action: PayloadAction<string>) => {
      state.scanId = action.payload;
      state.isPipelineActive = true;
    },
    setActiveRiskAssessmentId: (state, action: PayloadAction<string>) => {
      state.riskAssessmentId = action.payload;
    },
    setActiveComplianceId: (state, action: PayloadAction<string>) => {
      state.complianceId = action.payload;
    },
    // Explicit stage-transition actions for pipeline orchestration
    riskStarted: (state, action: PayloadAction<string>) => {
      state.riskAssessmentId = action.payload;
      state.isPipelineActive = true;
    },
    complianceStarted: (state, action: PayloadAction<string>) => {
      state.complianceId = action.payload;
      state.isPipelineActive = true;
    },
    // Mark pipeline as inactive when done or reset
    setPipelineActive: (state, action: PayloadAction<boolean>) => {
      state.isPipelineActive = action.payload;
    },
    clearActiveIds: (state) => {
      state.scanId = null;
      state.riskAssessmentId = null;
      state.complianceId = null;
      state.isPipelineActive = false;
    },
  },
});

export const {
  setActiveScanId,
  setActiveRiskAssessmentId,
  setActiveComplianceId,
  riskStarted,
  complianceStarted,
  setPipelineActive,
  clearActiveIds,
} = activeIdsSlice.actions;

export default activeIdsSlice.reducer;
