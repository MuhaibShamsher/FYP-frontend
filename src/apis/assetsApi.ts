import { baseApi } from './baseApi';
import type { Asset, Port, AssetSummary } from '@/types';

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssetById: builder.query<Asset, string>({
      query: (id) => `asset-management/assets/${id}/`,
      providesTags: (_r, _e, id) => [{ type: 'Assets', id }],
    }),

    updateAsset: builder.mutation<Asset, { id: string; data: Partial<Asset> }>({
      query: ({ id, data }) => ({
        url: `asset-management/assets/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Assets', id }],
    }),

    updatePort: builder.mutation<Port, { portId: string; data: Partial<Port> }>(
      {
        query: ({ portId, data }) => ({
          url: `asset-management/ports/${portId}/`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: (_r, _e, { portId }) => [
          { type: 'AssetPorts', id: portId },
        ],
      }
    ),

    deleteAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `asset-management/assets/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assets'],
    }),

    getAssetsSummary: builder.query<AssetSummary, void>({
      query: () => `asset-management/assets/summary/`,
      providesTags: ['AssetSummary'],
    }),

    getAssetPorts: builder.query<
      { asset_id: string; ip_address: string; ports: Port[] },
      string
    >({
      query: (assetId) => `asset-management/assets/${assetId}/ports/`,
      providesTags: (_r, _e, assetId) => [{ type: 'AssetPorts', id: assetId }],
    }),
  }),
});

export const {
  useGetAssetByIdQuery,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetAssetsSummaryQuery,
  useGetAssetPortsQuery,
  useUpdatePortMutation,
} = assetsApi;
