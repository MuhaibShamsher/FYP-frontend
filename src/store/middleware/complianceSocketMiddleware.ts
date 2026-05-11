import { baseApi } from '@/apis';
import { clearActiveIds, complianceStarted } from '@/store/slices/activeIdsSlice';
import { createSocketMiddleware } from './createSocketMiddleware';
import { toast } from 'sonner';


export const complianceSocketMiddleware = createSocketMiddleware({
  logPrefix: '[WS-COMPLIANCE]',

  openAction: complianceStarted,

  closeActions: [clearActiveIds],

  buildPath: (id) => `/ws/compliance/${id}/`,

  shouldReconnect: (state, id) =>
    state.activeIds?.complianceId === id &&
    state.activeIds?.isPipelineActive === true,

  onAuthFailure: (dispatch) => dispatch(clearActiveIds()),

  getPersistedId: (state) =>
    state.activeIds?.isPipelineActive && state.activeIds?.complianceId
      ? state.activeIds.complianceId
      : null,

  onMessage: (msg, dispatch, _id) => {
    if (msg?.type !== 'compliance_update' || !msg.data) return 'keep';

    switch (msg.data.status) {
      case 'completed': {
        toast.success('Compliance Inspection complete');
        dispatch(
          baseApi.util.invalidateTags(['ComplianceResults', 'RiskAssessments']),
        );
        console.debug('[WS-COMPLIANCE] Pipeline complete, clearing active IDs');
        dispatch(clearActiveIds());
        return 'close';
      }

      case 'failed':
        toast.error(`Compliance evaluation failed: ${msg.data.error ?? 'Unknown error'}`);
        return 'close';

      case 'cancelled':
        toast.info('Compliance inspection cancelled');
        return 'close';

      default:
        return 'keep';
    }
  },
});
