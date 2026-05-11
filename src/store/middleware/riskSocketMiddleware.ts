import { baseApi } from '@/apis';
import {
  clearActiveIds,
  riskStarted,
  complianceStarted,
} from '@/store/slices/activeIdsSlice';
import { createSocketMiddleware } from './createSocketMiddleware';
import { toast } from 'sonner';

export const riskSocketMiddleware = createSocketMiddleware({
  logPrefix: '[WS-RISK]',

  openAction: riskStarted,

  closeActions: [clearActiveIds],

  buildPath: (id) => `/ws/risk-assessment/${id}/`,

  shouldReconnect: (state, id) =>
    state.activeIds?.riskAssessmentId === id &&
    state.activeIds?.isPipelineActive === true,

  onAuthFailure: (dispatch) => dispatch(clearActiveIds()),

  getPersistedId: (state) =>
    state.activeIds?.isPipelineActive && state.activeIds?.riskAssessmentId
      ? state.activeIds.riskAssessmentId
      : null,

  onMessage: (msg, dispatch, _id) => {
    if (msg?.type !== 'assessment_update' || !msg.data) return 'keep';

    switch (msg.data.status) {
      case 'completed': {
        toast.success('Risk Assessment complete');
        dispatch(baseApi.util.invalidateTags(['RiskAssessments', 'Scans']));
        const complianceId = msg.data?.pipeline_meta?.compliance_assessment_id;
        if (complianceId) {
          console.debug(
            '[WS-RISK] Transitioning to compliance stage:',
            complianceId
          );
          dispatch(complianceStarted(complianceId));
        }
        return 'close';
      }

      case 'failed':
        toast.error(
          `Risk Assessment failed: ${msg.data.error ?? 'Unknown error'}`
        );
        return 'close';

      case 'cancelled':
        toast.info('Risk Assessment cancelled');
        return 'close';

      default:
        return 'keep';
    }
  },
});
