import { toast } from 'sonner';
import { baseApi } from '@/apis';
import { scanStarted, scanProgressUpdated, scanReset } from '@/store/slices/scanSessionSlice';
import { clearActiveIds, riskStarted } from '@/store/slices/activeIdsSlice';
import { createSocketMiddleware } from './createSocketMiddleware';

export const scanSocketMiddleware = createSocketMiddleware({
  logPrefix: '[WS-SCAN]',

  openAction: scanStarted,

  closeActions: [scanReset, clearActiveIds],

  buildPath: (id) => `/ws/scans/${id}/`,

  shouldReconnect: (state, id) =>
    state.scanSession?.isScanning === true &&
    state.scanSession?.scanId === id,

  onAuthFailure: (dispatch) => dispatch(scanReset()),

  getPersistedId: (state) =>
    state.scanSession?.isScanning && state.scanSession?.scanId
      ? state.scanSession.scanId
      : null,

  onMessage: (msg, dispatch, _id) => {
    if (msg?.type !== 'scan_update' || !msg.data) return 'keep';

    // Always forward progress to the slice so UI can render a live progress bar
    dispatch(scanProgressUpdated(msg.data));

    switch (msg.data.status) {
      case 'completed': {
        toast.success(`Network Scan completed`);
        dispatch(
          baseApi.util.invalidateTags(['Assets', 'Scans', 'Statistics']),
        );
        // Auto-transition: extract risk_assessment_id from pipeline_meta and open risk stage
        const riskAssessmentId = msg.data?.pipeline_meta?.risk_assessment_id;
        if (riskAssessmentId) {
          console.debug('[WS-SCAN] Transitioning to risk stage:', riskAssessmentId);
          dispatch(riskStarted(riskAssessmentId));
        }
        return 'close';
      }

      case 'failed':
        toast.error(`Scan failed: ${msg.data.error ?? 'Unknown error'}`);
        return 'close';

      case 'cancelled':
        toast.info(`Scan cancelled`);
        return 'close';

      default:
        return 'keep';
    }
  },
});
