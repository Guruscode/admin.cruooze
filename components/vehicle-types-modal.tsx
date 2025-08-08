"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VehicleTypeCount {
  type: string
  count: number
}

interface VehicleTypesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  dateRange: string
  vehicleTypes: VehicleTypeCount[]
}

export function VehicleTypesModal({ open, onOpenChange, title, dateRange, vehicleTypes }: VehicleTypesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title} Vehicle Types</DialogTitle>
          <p className="text-muted-foreground mt-1">Vehicle type breakdown for this month</p>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {vehicleTypes.map((type) => (
            <div key={type.type} className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
              <span className="text-lg font-medium">{type.type}</span>
              <span className="text-lg">{type.count} vehicles</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)} className="bg-blue-400 hover:bg-blue-500 text-white px-8">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
