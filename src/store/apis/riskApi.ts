import { baseApi } from './baseApi';
import type {
  Assessment,
  PaginatedResponse,
  AssetRiskProfileListItem,
  AssetRiskProfileDetail,
  Vulnerability,
  RiskDashboardStatistics,
} from '@/types';

export const riskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssessments: builder.query<
      PaginatedResponse<Assessment>,
      { status?: string; risk_level?: string; page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'risk-assessment/assessments/',
        params,
      }),
      providesTags: ['RiskAssessments'],
    }),

    createAssessment: builder.mutation<
      { assessment_id: string; status: string },
      { scan_id: string }
    >({
      query: (body) => ({
        url: 'risk-assessment/assessments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RiskAssessments'],
    }),

    getAssessmentDetails: builder.query<Assessment, string>({
      query: (id) => `risk-assessment/assessments/${id}/`,
    }),

    deleteAssessment: builder.mutation<void, string>({
      query: (id) => ({
        url: `risk-assessment/assessments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scans'],
    }),

    cancelAssessment: builder.mutation<void, string>({
      query: (id) => ({
        url: `risk-assessment/assessments/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: ['Scans'],
    }),

    getRiskProfiles: builder.query<
      PaginatedResponse<AssetRiskProfileListItem>,
      { assessmentId: string; risk_level?: string; page?: number; page_size?: number }
    >({
      query: ({ assessmentId, ...params }) => ({
        url: `risk-assessment/assessments/${assessmentId}/risk-profiles/`,
        params,
      }),
    }),

    getAssetRiskProfile: builder.query<
      AssetRiskProfileDetail,
      { assessmentId: string; assetId: string }
    >({
      query: ({ assessmentId, assetId }) => ({
        url: `risk-assessment/assessments/${assessmentId}/asset-profile/`,
        params: { asset_id: assetId },
      }),
    }),

    getAssessmentVulnerabilities: builder.query<
      PaginatedResponse<Vulnerability>,
      { assessmentId: string; severity?: string; page?: number; page_size?: number }
    >({
      query: ({ assessmentId, ...params }) => ({
        url: `risk-assessment/assessments/${assessmentId}/vulnerabilities/`,
        params,
      }),
    }),

    getRiskDashboard: builder.query<RiskDashboardStatistics, void>({
      query: () => 'risk-assessment/assessments/dashboard/',
      providesTags: ['AssetSummary'], // Use AssetSummary tag for dashboard updates
    }),
  }),
});

export const {
  useGetAssessmentsQuery,
  useCreateAssessmentMutation,
  useGetAssessmentDetailsQuery,
  useDeleteAssessmentMutation,
  useCancelAssessmentMutation,
  useGetRiskProfilesQuery,
  useGetAssetRiskProfileQuery,
  useGetAssessmentVulnerabilitiesQuery,
  useGetRiskDashboardQuery,
} = riskApi;
