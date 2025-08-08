"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export interface LearnerPermitDetails {
  id: string
  name: string
  route: string
  issuanceDate: Date
  issuedBy: string
  address: string
  phoneNumber: string
  vehicleClass: string
  expiryDate: Date
  permitNumber: string
}

interface LearnerPermitDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: LearnerPermitDetails | null
}

export function LearnerPermitDetailsModal({ open, onOpenChange, details }: LearnerPermitDetailsModalProps) {
  if (!details) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Learner's Permit Details</DialogTitle>
          <DialogDescription>
            Details for permit #{details.permitNumber} issued on{" "}
            {details.issuanceDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <p className="font-medium">{details.name}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Permit Number</Label>
            <p className="font-medium">{details.permitNumber}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Route</Label>
            <p className="font-medium">{details.route}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Vehicle Class</Label>
            <p className="font-medium">{details.vehicleClass}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Issuance Date</Label>
            <p className="font-medium">
              {details.issuanceDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Expiry Date</Label>
            <p className="font-medium">
              {details.expiryDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Issued By</Label>
            <p className="font-medium">{details.issuedBy}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Phone Number</Label>
            <p className="font-medium">{details.phoneNumber}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs text-muted-foreground">Address</Label>
            <p className="font-medium">{details.address}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            <Printer className="mr-2 h-4 w-4" />
            Print Permit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
