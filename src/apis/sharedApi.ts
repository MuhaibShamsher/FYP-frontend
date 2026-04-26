import { baseApi } from './baseApi';
import type { Scan, Assessment, ComplianceAssessmentListItem } from '@/types';

export interface PipelineStartResponse {
  pipeline_id: string;
  scan_id: string;
  risk_assessment_id: string;
  compliance_assessment_id: string;
  status: string;
}

export interface LatestPipelineResponse {
  scan: Scan;
  risk_assessment: Assessment;
  compliance_assessment: ComplianceAssessmentListItem;
}

export const sharedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Starts the full security pipeline:
    // Asset Scan -> Risk Assessment -> Compliance Inspection
    startPipeline: builder.mutation<
      PipelineStartResponse,
      { ip_range: string; scan_type: string; frameworks?: string[] }
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
