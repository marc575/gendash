"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

export interface Option {
  value: string
  label: string
  avatar?: string
}

interface MultiSelectProps {
  options: Option[]
  selected: Option[]
  onChange: (selected: Option[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((item) => item.value === option.value)
    if (isSelected) {
      onChange(selected.filter((item) => item.value !== option.value))
    } else {
      onChange([...selected, option])
    }
  }

  const handleRemove = (option: Option) => {
    onChange(selected.filter((item) => item.value !== option.value))
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-[40px] w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        {selected.length > 0 ? (
          selected.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1"
            >
              <span>{option.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(option)}
                className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-auto p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
          {options.map((option) => {
            const isSelected = selected.some((item) => item.value === option.value)
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer items-center px-3 py-2 hover:bg-accent",
                  isSelected && "bg-accent"
                )}
                onClick={() => handleSelect(option)}
              >
                <span className="flex-grow text-left">{option.label}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
