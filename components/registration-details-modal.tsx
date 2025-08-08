"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditJobModal } from "./edit-job-modal"

export interface RegistrationDetails {
  id: string
  name: string
  surname: string
  dob: string
  gender: string
  phone: string
  email: string
  state: string
  address: string
  carUse: string
  vehicleCategory: string
  make: string
  model: string
  colour: string
  certificatetype: string
  plate_type: string
  vinnumber: string
  engineNumber: string
  engineCapacity: string
  insurancename: string
  year_of_make: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  status: string
  uid: string
  registrationType: string
  vehicletype: string
  platenumber: string
}

interface RegistrationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: RegistrationDetails | null
}

export function RegistrationDetailsModal({ open, onOpenChange, details }: RegistrationDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  if (!details) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Job Details</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            </div>
            <DialogDescription>
              Registration ID: {details.uid} | Plate Number: {details.platenumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Owner Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Owner Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                  <p className="text-base">
                    {details.name} {details.surname}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                  <p className="text-base">{new Date(details.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                  <p className="text-base capitalize">{details.gender}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                  <p className="text-base">{details.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="text-base">{details.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">State</h4>
                  <p className="text-base">{details.state}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                  <p className="text-base">{details.address}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Vehicle Type</h4>
                  <p className="text-base">{details.vehicletype}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Vehicle Category</h4>
                  <p className="text-base">{details.vehicleCategory}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Car Use</h4>
                  <p className="text-base">{details.carUse}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Make</h4>
                  <p className="text-base">{details.make}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                  <p className="text-base">{details.model}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                  <p className="text-base">{details.year_of_make}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Colour</h4>
                  <p className="text-base">{details.colour}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Engine Capacity</h4>
                  <p className="text-base">{details.engineCapacity}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">VIN Number</h4>
                  <p className="text-base">{details.vinnumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Engine Number</h4>
                  <p className="text-base">{details.engineNumber}</p>
                </div>
              </div>
            </div>

            {/* Registration Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Registration Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Registration Type</h4>
                  <p className="text-base">{details.registrationType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Plate Number</h4>
                  <p className="text-base">{details.platenumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Plate Type</h4>
                  <p className="text-base">{details.plate_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Certificate Type</h4>
                  <p className="text-base">{details.certificatetype}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Insurance Provider</h4>
                  <p className="text-base">{details.insurancename}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Registration ID</h4>
                  <p className="text-base">{details.uid}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created On</h4>
                  <p className="text-base">{new Date(details.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                  <p className="text-base">{details.created_by}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                  <p className="text-base">{new Date(details.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Updated By</h4>
                  <p className="text-base">{details.updated_by}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditJobModal open={showEditModal} onOpenChange={setShowEditModal} details={details} />
    </>
  )
}
