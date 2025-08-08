"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddNewPlateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddNewPlateModal({ isOpen, onClose }: AddNewPlateModalProps) {
  const [formData, setFormData] = useState({
    plateNumber: "",
    stationName: "",
    plateType: "",
    status: "Active",
  })

  const stations = [
    "Asaba Central",
    "Warri Station",
    "Ughelli Station",
    "Benin City Station",
    "Lagos Station",
    "Abuja Station",
    "Kano Station",
    "Ibadan Station",
    "Enugu Station",
    "Port Harcourt Station",
    "Jos Station",
    "Kaduna Station",
  ]

  const plateTypes = ["Private", "Commercial", "Government", "Motorcycle", "Truck"]

  const statuses = ["Active", "Inactive", "Used"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    onClose()
  }

  const handleCancel = () => {
    setFormData({
      plateNumber: "",
      stationName: "",
      plateType: "",
      status: "Active",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Plate</DialogTitle>
          <p className="text-muted-foreground">Create a new plate number in the system.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="plateNumber" className="text-base font-medium">
              Plate Number
            </Label>
            <Input
              id="plateNumber"
              placeholder="e.g., ABC123DE"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              className="h-12 text-base border-2 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stationName" className="text-base font-medium">
              Station Name
            </Label>
            <Select
              value={formData.stationName}
              onValueChange={(value) => setFormData({ ...formData, stationName: value })}
              required
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plateType" className="text-base font-medium">
              Plate Type
            </Label>
            <Select
              value={formData.plateType}
              onValueChange={(value) => setFormData({ ...formData, plateType: value })}
              required
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select plate type" />
              </SelectTrigger>
              <SelectContent>
                {plateTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-base font-medium">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 text-base bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700">
              Add Plate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
