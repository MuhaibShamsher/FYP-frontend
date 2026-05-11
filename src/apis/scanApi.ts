import { baseApi } from './baseApi';
import type { Scan, ScanStatistics, Asset } from '@/types';

export interface ScansResponse {
  scans: Scan[];
  statistics: ScanStatistics;
}

export interface ScanAssetsResponse {
  scan_id: string;
  total_assets: number;
  assets: Asset[];
}

export const scansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScans: builder.query<ScansResponse, void>({
      query: () => 'asset-management/scans/',
      providesTags: ['Scans'],
    }),

    createScan: builder.mutation<{ scan_id: string; status: string }, Partial<Scan>>({
      query: (body) => ({
        url: 'asset-management/scans/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Scans'],
    }),

    getScanDetails: builder.query<Scan, string>({
      query: (id) => `asset-management/scans/${id}/`,
      providesTags: (_r, _e, id) => [{ type: 'ScanDetails', id }],
    }),

    deleteScan: builder.mutation<void, string>({
      query: (id) => ({
        url: `asset-management/scans/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scans'],
    }),

    cancelScan: builder.mutation<{ scan_id: string }, string>({
      query: (id) => ({
        url: `asset-management/scans/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: ['Scans'],
    }),

    getScanAssets: builder.query<ScanAssetsResponse, string>({
      query: (scanId) => `asset-management/scans/${scanId}/assets/`,
      providesTags: ['Assets'],
    }),

    getLastScanAssets: builder.query<ScanAssetsResponse, void>({
      query: () => 'asset-management/scans/assets/',
      providesTags: ['Assets'],
    }),
  }),
});

export const {
  useGetScansQuery,
  useCreateScanMutation,
  useGetScanDetailsQuery,
  useDeleteScanMutation,
  useCancelScanMutation,
  useGetScanAssetsQuery,
  useGetLastScanAssetsQuery,
} = scansApi;
