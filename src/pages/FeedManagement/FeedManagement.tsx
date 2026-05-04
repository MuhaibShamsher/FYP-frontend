import { useFeedManagementPage } from '@/hooks';
import { LoadingState, ErrorState, FeedCard } from '@/components/custom';
import { Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';
import feedStyles from './FeedManagement.module.css';

export default function FeedManagement() {
  const { feeds, isLoading, isError, isUpdating, syncFeed, refreshFeeds } =
    useFeedManagementPage();

  if (isLoading) {
    return <LoadingState text="Loading feed status..." />;
  }

  if (isError || !feeds) {
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
            onClick={() => refreshFeeds()}
            variant="outline"
            className={feedStyles.refreshButton}
            disabled={isUpdating}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`}
            />
            {isUpdating ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>

        {/* Feed Cards Grid */}
        <div className={feedStyles.feedCardsGrid}>
          {feeds.map((feed) => (
            <FeedCard
              key={feed.feed_type}
              feed={feed}
              onSync={() => syncFeed(feed.feed_type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
