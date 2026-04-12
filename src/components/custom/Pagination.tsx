import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles/Pagination.module.css';

interface TerminalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  isFetching?: boolean;
  itemLabel?: string;
}

export default function TerminalPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 20,
  isFetching = false,
  itemLabel = 'Vulnerabilities',
}: TerminalPaginationProps) {
  if (totalPages <= 0) return null;

  const startRange = ((currentPage - 1) * itemsPerPage) + 1;
  const endRange = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > totalPages - 4) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`${styles.paginationFooter} ${isFetching ? styles.isFetching : ''}`}>
      <div className={styles.paginationInfo}>
          {totalItems !== undefined ? (
            <>
            Showing <span className={styles.pageHighlight}>{startRange}</span> to{' '}
            <span className={styles.pageHighlight}>{endRange}</span> of{' '}
            <span className={styles.pageHighlight}>{totalItems}</span> {itemLabel}
            </>
          ) : (
            <>
            Page <span className={styles.pageHighlight}>{currentPage}</span> of{' '}
            <span className={styles.pageHighlight}>{totalPages}</span>
            </>
          )}
      </div>

      <div className={styles.paginationControls}>
        <button
          className={styles.pageButton}
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className={`w-4 h-4 ${styles.arrowIcon} ${styles.arrowIconPrev}`} /> PREV
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((pageNum, idx) => (
            <React.Fragment key={idx}>
              {pageNum === '...' ? (
                <span className="px-2 text-slate-600 font-mono text-xs flex items-center">...</span>
              ) : (
                <button
                  className={`${styles.pageButton} ${
                    currentPage === pageNum ? styles.pageButtonActive : ''
                  } p-0! w-9 h-9 flex items-center justify-center font-mono`}
                  onClick={() => onPageChange(pageNum as number)}
                  disabled={isFetching}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={styles.pageButton}
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
        >
          NEXT <ChevronRight className={`w-4 h-4 ${styles.arrowIcon} ${styles.arrowIconNext}`} />
        </button>
      </div>
    </div>
  );
}
