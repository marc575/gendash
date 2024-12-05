"use client";

import { TaskStatus } from "@/store/dashboardStore";
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  currentFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
}

const filters: { label: string; value: TaskStatus }[] = [
  { label: "Tous", value: "all" },
  { label: "En cours", value: "open" },
  { label: "Terminées", value: "closed" },
  { label: "Archivées", value: "archived" },
];

export function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
            "min-w-[100px] whitespace-nowrap",
            currentFilter === filter.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}