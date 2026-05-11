import { baseApi } from './baseApi';
import type {
  Scan,
  Assessment,
  ComplianceAssessmentListItem,
  AssetSummary,
  RiskDashboardStatistics,
} from '@/types';

export interface PipelineStartResponse {
  pipeline_id: string;
  scan_id: string;
  risk_assessment_id: string;
  compliance_assessment_id: string;
  status: string;
}

export interface LatestPipelineResponse {
  asset_scan: {
    scan: Scan;
    summary: AssetSummary;
  };
  risk_assessment: {
    assessment: Assessment;
    statistics: RiskDashboardStatistics['statistics'];
  };
  compliance: {
    compliance_assessment: ComplianceAssessmentListItem | null;
  };
}

export const sharedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Starts the full pipeline: Asset Scan -> Risk Assessment -> Compliance Inspection
    startPipeline: builder.mutation<
      PipelineStartResponse,
      { network_range: string; scan_type: string; frameworks?: string[] }
    >({
      query: (body) => ({
        url: 'shared/scan/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Scans', 'RiskAssessments', 'ComplianceResults'],
    }),

    // Fetches the latest completed objects from the pipeline
    getLatestPipeline: builder.query<LatestPipelineResponse, void>({
      query: () => 'shared/latest/',
      providesTags: ['Scans', 'RiskAssessments', 'ComplianceResults'],
    }),
  }),
});

export const { useStartPipelineMutation, useGetLatestPipelineQuery } = sharedApi;
