import LoadingState from '@/components/custom/LoadingState';
import ErrorState from '@/components/custom/ErrorState';
import feedStyles from './styles/FeedManagement.module.css';
import FeedCard from '@/components/custom/FeedCard';
import type { FeedType } from '@/types';
import { useSyncFeedMutation, useGetFeedStatusQuery } from '@/store/apis/feedApis';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';


export default function FeedManagement() {
  const {
    data: feedStatus,
    isLoading,
    isError,
    refetch,
  } = useGetFeedStatusQuery();
  const [syncFeed] = useSyncFeedMutation();

  const handleSync = async (feedType: FeedType) => {
    try {
      await syncFeed({ feed_type: feedType }).unwrap();
      setTimeout(() => refetch(), 4000);
    } catch (error) {
      console.error('Failed to sync feed:', error);
    }
  };

  if (isLoading) {
    return <LoadingState text="Loading feed status..." />;
  }

  if (isError || !feedStatus) {
    return (
      <ErrorState
        title="Failed to Load Feed Status"
        message="Unable to retrieve feed synchronization status. Please try again."
      />
    );
  }

  return (
    <div className={feedStyles.pageContainer}>
      <div className="space-y-8">
        {/* Simplified Header Section */}
        <div className={feedStyles.headerSection}>
          <div className={feedStyles.headerContent}>
            <div className={feedStyles.headerTitleContainer}>
              <h1 className={feedStyles.headerTitle}>Feed Management</h1>
            </div>
            <p className={feedStyles.headerDescription}>
              Monitor and synchronize external threat intelligence feeds
            </p>
          </div>

          <Button
            onClick={() => refetch()}
            variant="outline"
            className={feedStyles.refreshButton}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {/* Feed Cards Grid */}
        <div className={feedStyles.feedCardsGrid}>
          {feedStatus.feeds.map((feed) => (
            <FeedCard
              key={feed.feed_type}
              feed={feed}
              onSync={() => handleSync(feed.feed_type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
