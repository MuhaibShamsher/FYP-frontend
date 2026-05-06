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
      <div className={feedStyles.headerSection}>
        <div>
          <div className={feedStyles.systemOverviewLabel}>
            <div className={feedStyles.statusDotActive} />
            Feed Synchronization
          </div>
          <h1 className={feedStyles.pageTitle}>FEED MANAGEMENT</h1>
        </div>

        <Button
          onClick={() => refreshFeeds()}
          className={feedStyles.refreshButton}
          disabled={isUpdating}
        >
          <RefreshCw
            className={`${feedStyles.refreshIcon} ${isUpdating ? 'animate-spin' : ''}`}
          />
          {isUpdating ? 'REFRESHING...' : 'REFRESH STATUS'}
        </Button>
      </div>

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
  );
}
