import { useState, useEffect, useCallback } from 'react';
import {
  useGetFeedStatusQuery,
  useSyncFeedMutation,
} from '@/store/apis/feedApis';
import type { FeedStatus, FeedType } from '@/types';
import { toast } from 'sonner';

interface UseFeedManagementPageReturn {
  feeds: FeedStatus[];
  selectedFeed: FeedStatus | null;
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  isTesting: boolean;
  error: any;
  selectFeed: (feed: FeedStatus | null) => void;
  syncFeed: (feedType: FeedType) => Promise<void>;
  refreshFeeds: () => void;

  // Computed states
  activeFeeds: FeedStatus[];
  staleFeeds: FeedStatus[];
  feedsWithErrors: FeedStatus[];
}

export default function useFeedManagementPage(): UseFeedManagementPageReturn {
  const [selectedFeed, setSelectedFeed] = useState<FeedStatus | null>(null);
  const [feeds, setFeeds] = useState<FeedStatus[]>([]);

  // API queries and mutations
  const {
    data: feedsData,
    isLoading: feedsLoading,
    isError: feedsError,
    error: feedsErrorData,
    refetch: refetchFeeds,
  } = useGetFeedStatusQuery();

  const [syncFeedMutation, { isLoading: isUpdating }] = useSyncFeedMutation();

  // Update feeds data when API result changes
  useEffect(() => {
    if (feedsData?.feeds) {
      setFeeds(feedsData.feeds);
    }
  }, [feedsData]);

  // Computed states
  const activeFeeds = feeds.filter((feed) => !feed.is_stale);
  const staleFeeds = feeds.filter((feed) => feed.is_stale);
  const feedsWithErrors = feeds.filter((feed) => feed.records_errors > 0);

  // Actions
  const selectFeed = useCallback((feed: FeedStatus | null) => {
    setSelectedFeed(feed);
  }, []);

  const syncFeedHandler = useCallback(
    async (feedType: FeedType) => {
      try {
        await syncFeedMutation({ feed_type: feedType }).unwrap();
        toast.success('Feed sync initiated successfully!');
        refetchFeeds();
      } catch (error: any) {
        console.error('Failed to sync feed:', error);
        toast.error(error?.data?.message || 'Failed to sync feed');
      }
    },
    [syncFeedMutation, refetchFeeds]
  );

  const refreshFeedsHandler = useCallback(() => {
    refetchFeeds();
  }, [refetchFeeds]);

  return {
    feeds,
    selectedFeed,
    isLoading: feedsLoading,
    isError: feedsError,
    isUpdating,
    isTesting: false,
    error: feedsErrorData,
    selectFeed,
    syncFeed: syncFeedHandler,
    refreshFeeds: refreshFeedsHandler,
    activeFeeds,
    staleFeeds,
    feedsWithErrors,
  };
}
