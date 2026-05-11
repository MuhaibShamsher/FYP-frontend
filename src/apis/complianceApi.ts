import { baseApi } from './baseApi';
import type {
  ComplianceAssessmentListItem,
  ComplianceFramework,
  PaginatedResponse,
  FrameworkSummary,
  ComplianceResult,
  ViolatingAsset,
} from '@/types';

export const complianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceAssessments: builder.query<
      PaginatedResponse<ComplianceAssessmentListItem>,
      { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'compliance/assessments/',
        params,
      }),
      providesTags: ['ComplianceResults'],
    }),

    createComplianceAssessment: builder.mutation<
      { compliance_assessment_id: string; status: string; frameworks: string[] },
      { risk_assessment: string; frameworks: ComplianceFramework[] }
    >({
      query: (body) => ({
        url: 'compliance/assessments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ComplianceResults', 'RiskAssessments'],
    }),

    getComplianceDetails: builder.query<
      ComplianceAssessmentListItem,
      string
    >({
      query: (id) => `compliance/assessments/${id}/`,
    }),

    cancelComplianceAssessment: builder.mutation<
      { compliance_assessment_id: string },
      string
    >({
      query: (id) => ({
        url: `compliance/assessments/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: ['Scans'],
    }),

    getComplianceSummary: builder.query<
      { 
        compliance_assessment_id: string; 
        status: string; 
        frameworks: string[]; 
        summaries: FrameworkSummary[] 
      },
      string
    >({
      query: (id) => `compliance/assessments/${id}/summary/`,
    }),

    getComplianceResults: builder.query<
      PaginatedResponse<ComplianceResult>,
      { 
        id: string; 
        framework?: string; 
        status?: string; 
        category?: string; 
        page?: number; 
        page_size?: number 
      }
    >({
      query: ({ id, ...params }) => ({
        url: `compliance/assessments/${id}/results/`,
        params,
      }),
    }),

    getComplianceViolations: builder.query<
      ViolatingAsset[],
      string
    >({
      query: (id) => `compliance/assessments/${id}/violations/`,
    }),
  }),
});

export const {
  useGetComplianceAssessmentsQuery,
  useCreateComplianceAssessmentMutation,
  useGetComplianceDetailsQuery,
  useCancelComplianceAssessmentMutation,
  useGetComplianceSummaryQuery,
  useGetComplianceResultsQuery,
  useGetComplianceViolationsQuery,
} = complianceApi;
