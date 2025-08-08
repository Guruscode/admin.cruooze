"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateRangePickerProps {
  className?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function DateRangePicker({ className, dateRange, onDateRangeChange }: DateRangePickerProps) {
  // State for the date inputs
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Update input fields when dateRange prop changes
  useEffect(() => {
    if (dateRange?.from) {
      setStartDate(format(dateRange.from, "yyyy-MM-dd"))
    }
    if (dateRange?.to) {
      setEndDate(format(dateRange.to, "yyyy-MM-dd"))
    }
  }, [dateRange])

  return (
    <div className={cn("grid gap-2", className)}>
      {/* Two separate date inputs for from and to dates */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="from-date" className="text-xs text-muted-foreground">
            From Date
          </Label>
          <Input
            id="from-date"
            type="date"
            value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const newFromDate = new Date(e.target.value)
              if (!isNaN(newFromDate.getTime())) {
                onDateRangeChange({
                  from: newFromDate,
                  to: dateRange?.to || newFromDate,
                })
              }
            }}
            className="w-[140px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="to-date" className="text-xs text-muted-foreground">
            To Date
          </Label>
          <Input
            id="to-date"
            type="date"
            value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const newToDate = new Date(e.target.value)
              if (!isNaN(newToDate.getTime())) {
                onDateRangeChange({
                  from: dateRange?.from || newToDate,
                  to: newToDate,
                })
              }
            }}
            className="w-[140px]"
          />
        </div>
      </div>
    </div>
  )
}
