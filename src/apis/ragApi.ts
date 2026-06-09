import { baseApi } from './baseApi';

export interface VulnerabilityRemediation {
  id: string;
  response_type: string;
  generated_content: {
    message: any;
    rollback?: string;
    citations?: string[];
    immediate?: string[];
    long_term?: string[];
    short_term?: string[];
    validation?: string[];
  };
  model_name: string;
  confidence_level: string;
}

export interface ComplianceExplanation {
  explanation: string;
}

export const ragApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVulnerabilityRemediation: builder.query<VulnerabilityRemediation, { vuln_id: string }>({
      query: ({ vuln_id }) => ({
        url: `rag/vulnerability/${vuln_id}/remediation/`,
        method: 'GET',
      }),
    }),
    getComplianceExplanation: builder.query<ComplianceExplanation, { result_id: string }>({
      query: ({ result_id }) => ({
        url: `rag/compliance/${result_id}/explanation/`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetVulnerabilityRemediationQuery,
  useLazyGetVulnerabilityRemediationQuery,
  useGetComplianceExplanationQuery,
  useLazyGetComplianceExplanationQuery,
} = ragApi;
