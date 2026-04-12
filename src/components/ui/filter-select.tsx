import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  children: React.ReactNode
}

const FilterSelect = React.forwardRef<HTMLButtonElement, FilterSelectProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          ref={ref}
          className={cn(
            "h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className
          )}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    )
  }
)
FilterSelect.displayName = "FilterSelect"

export { FilterSelect, SelectItem }
