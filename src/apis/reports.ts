import { baseApi } from './baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateScanReport: builder.mutation<Blob, string>({
      query: (scanId) => ({
        url: `asset-management/reports/${scanId}/pdf`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
});

export const { useGenerateScanReportMutation } = reportsApi;
