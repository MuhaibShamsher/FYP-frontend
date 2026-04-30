import { baseApi } from '@/apis';
import { clearActiveIds, setActiveRiskAssessmentId } from '@/store/slices/activeIdsSlice';
import { createSocketMiddleware } from './createSocketMiddleware';
import { toast } from 'sonner';

export const riskSocketMiddleware = createSocketMiddleware({
  logPrefix: '[WS-RISK]',

  openAction: setActiveRiskAssessmentId,

  closeActions: [clearActiveIds],

  buildPath: (id) => `/ws/risk-assessment/${id}/`,

  shouldReconnect: (state, id) =>
    state.activeIds?.riskAssessmentId === id,

  onAuthFailure: (dispatch) => dispatch(clearActiveIds()),

  getPersistedId: (state) =>
    state.activeIds?.riskAssessmentId ?? null,

  onMessage: (msg, dispatch, _id) => {
    if (msg?.type !== 'assessment_update' || !msg.data) return 'keep';

    switch (msg.data.status) {
      case 'completed':
        toast.success('Risk Assessment complete');
        dispatch(
          baseApi.util.invalidateTags(['RiskAssessments', 'Scans']),
        );
        return 'close';

      case 'failed':
        toast.error(`Risk Assessment failed: ${msg.data.error ?? 'Unknown error'}`);
        return 'close';

      case 'cancelled':
        toast.info('Risk Assessment cancelled');
        return 'close';

      default:
        return 'keep';
    }
  },
});
