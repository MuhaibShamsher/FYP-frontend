import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect, SelectItem } from '@/components/ui/filter-select';
import type { ComplianceFramework } from '@/types';
import styles from '@/components/compliance/styles/ComplianceResultsLayout.module.css';

interface ComplianceFiltersProps {
  categoryInput: string;
  onCategoryInputChange: (value: string) => void;
  placeholder: string;
  framework: ComplianceFramework;
  onFrameworkChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function ComplianceFilters({
  categoryInput,
  onCategoryInputChange,
  placeholder,
  framework,
  onFrameworkChange,
  statusFilter,
  onStatusFilterChange,
}: ComplianceFiltersProps) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchContainer}>
        <SearchInput
          placeholder={placeholder}
          value={categoryInput}
          onChange={onCategoryInputChange}
          aria-label="Filter by framework category"
        />
      </div>

      <FilterSelect
        value={framework}
        onValueChange={onFrameworkChange}
        placeholder="Framework"
      >
        <SelectItem value="iso27001">ISO 27001</SelectItem>
        <SelectItem value="nist">NIST</SelectItem>
        <SelectItem value="cis">CIS</SelectItem>
      </FilterSelect>

      <FilterSelect
        value={statusFilter}
        onValueChange={onStatusFilterChange}
        placeholder="Status"
      >
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="pass">Pass</SelectItem>
        <SelectItem value="fail">Fail</SelectItem>
        <SelectItem value="partial">Partial</SelectItem>
      </FilterSelect>
    </div>
  );
}
