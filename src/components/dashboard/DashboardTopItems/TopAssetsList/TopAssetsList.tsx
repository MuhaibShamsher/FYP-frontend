import styles from './TopAssetsList.module.css';
import { TopPriorityList } from '../TopPriorityList/TopPriorityList.tsx';
import type { DashboardTopAsset } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

export function TopAssetsList({ items }: { items: DashboardTopAsset[] }) {
  const navigate = useNavigate();

  return (
    <TopPriorityList
      items={items}
      emptyMessage="No critical assets found"
      styles={styles as Record<string, string>}
      getKey={(asset: DashboardTopAsset, index: number) =>
        `${asset.asset_id ?? index}`
      }
      renderTitle={(asset: DashboardTopAsset) => (
        <div className={styles.itemTitle}>
          {asset.hostname || asset.ip_address || 'Unknown asset'}
        </div>
      )}
      renderSubline={(asset: DashboardTopAsset) => (
        <>
          <span className={styles.monoBadge}>{asset.ip_address || '—'}</span>
          <span className={styles.mutedText}>
            {asset.device_type || 'asset'}
          </span>
        </>
      )}
      renderMeta={(asset: DashboardTopAsset) => (
        <>
          <span className={styles.scoreBadge}>
            Vulns Count: {asset.vulnerability_count ?? 0}
          </span>
          <span className={styles.mutedText}>
            {asset.is_kev_affected ? 'KEV Affected' : null}
          </span>
        </>
      )}
      onItemClick={(asset: DashboardTopAsset) => {
        if (asset.asset_id) {
          navigate(`/assets/${asset.asset_id}`);
        }
      }}
    />
  );
}
