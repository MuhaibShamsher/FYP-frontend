import { baseApi } from '@/apis';
import { clearActiveIds, setActiveComplianceId } from '@/store/slices/activeIdsSlice';
import { createSocketMiddleware } from './createSocketMiddleware';
import { toast } from 'sonner';

export const complianceSocketMiddleware = createSocketMiddleware({
  logPrefix: '[WS-COMPLIANCE]',

  openAction: setActiveComplianceId,

  closeActions: [clearActiveIds],

  buildPath: (id) => `/ws/compliance/${id}/`,

  shouldReconnect: (state, id) =>
    state.activeIds?.complianceId === id,

  onAuthFailure: (dispatch) => dispatch(clearActiveIds()),

  getPersistedId: (state) =>
    state.activeIds?.complianceId ?? null,

  onMessage: (msg, dispatch, _id) => {
    if (msg?.type !== 'compliance_update' || !msg.data) return 'keep';

    switch (msg.data.status) {
      case 'completed':
        toast.success('Compliance Inspection complete');
        dispatch(
          baseApi.util.invalidateTags(['ComplianceResults', 'RiskAssessments']),
        );
        return 'close';

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
