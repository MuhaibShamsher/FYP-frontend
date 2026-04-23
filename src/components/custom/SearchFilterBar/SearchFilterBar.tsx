import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect, SelectItem } from '@/components/ui/filter-select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from './SearchFilterBar.module.css';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: FilterOption[];
}

interface ToggleConfig {
  label: string;
  isActive: boolean;
  onToggle: () => void;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link';
  icon?: React.ReactNode;
  className?: string;
}

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchAriaLabel?: string;
  filters?: FilterConfig[];
  toggles?: ToggleConfig[];
  className?: string;
}

export default function SearchFilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  searchAriaLabel = 'Search',
  filters = [],
  toggles = [],
  className,
}: SearchFilterBarProps) {
  const hasSearch = !!onSearchChange;
  const hasFilters = filters.length > 0;
  const hasToggles = toggles.length > 0;
  const hasAnyContent = hasSearch || hasFilters || hasToggles;

  if (!hasAnyContent) {
    return null;
  }

  const containerClasses = cn(styles.container, className);

  return (
    <div className={containerClasses}>
      {hasSearch && (
        <div className={styles.searchContainer}>
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            aria-label={searchAriaLabel}
          />
        </div>
      )}

      {hasFilters && (
        <div className={styles.filtersContainer}>
          {filters.map((filter) => (
            <FilterSelect
              key={filter.placeholder}
              value={filter.value}
              onValueChange={filter.onValueChange}
              placeholder={filter.placeholder}
            >
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </FilterSelect>
          ))}
        </div>
      )}

      {hasToggles && (
        <div className={styles.togglesContainer}>
          {toggles.map((toggle) => (
            <Button
              key={toggle.label}
              onClick={toggle.onToggle}
              variant={
                toggle.variant || (toggle.isActive ? 'default' : 'outline')
              }
              className={cn(styles.toggle, toggle.className, {
                [styles.toggleActive]: toggle.isActive,
              })}
            >
              {toggle.icon}
              {toggle.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
