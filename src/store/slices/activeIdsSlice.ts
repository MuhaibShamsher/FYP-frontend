import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ActiveIdsState {
  scanId: string | null;
  riskAssessmentId: string | null;
  complianceId: string | null;
  isPipelineActive: boolean;
  riskProgress: number;
  complianceProgress: number;
}

const initialState: ActiveIdsState = {
  scanId: null,
  riskAssessmentId: null,
  complianceId: null,
  isPipelineActive: false,
  riskProgress: 0,
  complianceProgress: 0,
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
    updateRiskProgress: (state, action: PayloadAction<number>) => {
      state.riskProgress = action.payload;
    },
    updateComplianceProgress: (state, action: PayloadAction<number>) => {
      state.complianceProgress = action.payload;
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
      state.riskProgress = 0;
      state.complianceProgress = 0;
    },
  },
});

export const {
  setActiveScanId,
  setActiveRiskAssessmentId,
  setActiveComplianceId,
  riskStarted,
  complianceStarted,
  updateRiskProgress,
  updateComplianceProgress,
  setPipelineActive,
  clearActiveIds,
} = activeIdsSlice.actions;

export default activeIdsSlice.reducer;
