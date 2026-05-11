import { baseApi } from './baseApi';
import type { FeedStatusResponse, FeedType } from '@/types';

export const feedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Trigger manual feed sync
    syncFeed: builder.mutation<void, { feed_type: FeedType }>({
      query: (feedData) => ({
        url: '/feeds/sync/',
        method: 'POST',
        body: feedData,
      }),
    }),

    // Get feed status
    getFeedStatus: builder.query<FeedStatusResponse, void>({
      query: () => '/feeds/status/',
    }),
  }),
});

export const { useSyncFeedMutation, useGetFeedStatusQuery } = feedApi;
