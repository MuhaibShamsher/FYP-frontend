import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SearchInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder, value, onChange, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          className={cn('pl-10', className)}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
