import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScanProgressUpdate } from '@/types';

interface ScanSessionState {
  scanId: string | null;
  isScanning: boolean;
  status: string;
  message: string;
  progress: number;
  totalHosts: number;
  currentHost: number;
  host: string;
  portsFound: number;
  assetsCreated: number;
  portsCreated: number;
  successful: number;
  failed: number;
  error: string;
}

const initialState: ScanSessionState = {
  scanId: null,
  isScanning: false,
  status: 'idle',
  message: '',
  progress: 0,
  totalHosts: 0,
  currentHost: 0,
  host: '',
  portsFound: 0,
  assetsCreated: 0,
  portsCreated: 0,
  successful: 0,
  failed: 0,
  error: '',
};

const scanSessionSlice = createSlice({
  name: 'scanSession',
  initialState,
  reducers: {
    scanStarted: (_state, action: PayloadAction<string>) => {
      return {
        ...initialState,
        scanId: action.payload,
        isScanning: true,
        status: 'running',
      };
    },

    scanProgressUpdated: (state, action: PayloadAction<ScanProgressUpdate>) => {
      const d = action.payload;
      state.status = d.status;
      state.message = d.message;
      state.progress = d.progress;
      state.totalHosts = d.total_hosts;
      state.currentHost = d.current_host;
      state.host = d.host;
      state.portsFound = d.ports_found;
      state.assetsCreated = d.assets_created;
      state.portsCreated = d.ports_created;
      state.successful = d.successful;
      state.failed = d.failed;
      state.error = d.error;
      if (['completed', 'failed', 'cancelled'].includes(d.status)) {
        state.isScanning = false;
      }
    },

    scanReset: () => initialState,
  },
});

export const { scanStarted, scanProgressUpdated, scanReset } =
  scanSessionSlice.actions;
export default scanSessionSlice.reducer;
