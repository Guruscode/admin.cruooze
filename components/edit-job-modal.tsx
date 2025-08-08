"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Car, FileText, CheckCircle, ArrowLeft } from "lucide-react"
import type { RegistrationDetails } from "./registration-details-modal"

interface EditJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: RegistrationDetails | null
}

export function EditJobModal({ open, onOpenChange, details }: EditJobModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: details?.name || "",
    surname: details?.surname || "",
    dob: details?.dob || "",
    gender: details?.gender || "",
    phone: details?.phone || "",
    email: details?.email || "",
    state: details?.state || "",
    address: details?.address || "",
    carUse: details?.carUse || "",
    vehicleCategory: details?.vehicleCategory || "",
    make: details?.make || "",
    model: details?.model || "",
    colour: details?.colour || "",
    certificatetype: details?.certificatetype || "",
    plate_type: details?.plate_type || "",
    vinnumber: details?.vinnumber || "",
    engineNumber: details?.engineNumber || "",
    engineCapacity: details?.engineCapacity || "",
    insurancename: details?.insurancename || "",
    year_of_make: details?.year_of_make || "",
    registrationType: details?.registrationType || "",
    vehicletype: details?.vehicletype || "",
    platenumber: details?.platenumber || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowConfirmation(false)
    onOpenChange(false)
    // Show success message or update parent component
  }

  const handleBackToEdit = () => {
    setShowConfirmation(false)
  }

  if (!details) return null

  const editFee = "₦2,500"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Job Details</DialogTitle>
              <DialogDescription>Update job information for Registration ID: {details.uid}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Owner Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">First Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Last Name</Label>
                      <Input
                        id="surname"
                        value={formData.surname}
                        onChange={(e) => handleInputChange("surname", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja</SelectItem>
                          <SelectItem value="kano">Kano</SelectItem>
                          <SelectItem value="rivers">Rivers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicletype">Vehicle Type</Label>
                      <Select
                        value={formData.vehicletype}
                        onValueChange={(value) => handleInputChange("vehicletype", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleCategory">Vehicle Category</Label>
                      <Select
                        value={formData.vehicleCategory}
                        onValueChange={(value) => handleInputChange("vehicleCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carUse">Car Use</Label>
                      <Select value={formData.carUse} onValueChange={(value) => handleInputChange("carUse", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select car use" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="hire">Hire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        value={formData.make}
                        onChange={(e) => handleInputChange("make", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year_of_make">Year of Make</Label>
                      <Input
                        id="year_of_make"
                        value={formData.year_of_make}
                        onChange={(e) => handleInputChange("year_of_make", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colour">Color</Label>
                      <Input
                        id="colour"
                        value={formData.colour}
                        onChange={(e) => handleInputChange("colour", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineCapacity">Engine Capacity</Label>
                      <Input
                        id="engineCapacity"
                        value={formData.engineCapacity}
                        onChange={(e) => handleInputChange("engineCapacity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vinnumber">VIN Number</Label>
                      <Input
                        id="vinnumber"
                        value={formData.vinnumber}
                        onChange={(e) => handleInputChange("vinnumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineNumber">Engine Number</Label>
                      <Input
                        id="engineNumber"
                        value={formData.engineNumber}
                        onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Registration Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationType">Registration Type</Label>
                      <Select
                        value={formData.registrationType}
                        onValueChange={(value) => handleInputChange("registrationType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select registration type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platenumber">Plate Number</Label>
                      <Input
                        id="platenumber"
                        value={formData.platenumber}
                        onChange={(e) => handleInputChange("platenumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plate_type">Plate Type</Label>
                      <Select
                        value={formData.plate_type}
                        onValueChange={(value) => handleInputChange("plate_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select plate type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                          <SelectItem value="diplomatic">Diplomatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certificatetype">Certificate Type</Label>
                      <Select
                        value={formData.certificatetype}
                        onValueChange={(value) => handleInputChange("certificatetype", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select certificate type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pm">PM</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancename">Insurance Provider</Label>
                      <Select
                        value={formData.insurancename}
                        onValueChange={(value) => handleInputChange("insurancename", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gni">GNI</SelectItem>
                          <SelectItem value="aiico">AIICO</SelectItem>
                          <SelectItem value="leadway">Leadway</SelectItem>
                          <SelectItem value="cornerstone">Cornerstone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Job Edit</DialogTitle>
              <DialogDescription>Review your changes and confirm the edit fee</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Edit Fee Card */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Edit Fee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-sm text-orange-700 mb-2">You will be charged for editing this job</p>
                    <p className="text-2xl font-bold text-orange-800">{editFee}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Owner Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                    <p className="text-base">
                      {formData.name} {formData.surname}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                    <p className="text-base">{formData.dob ? new Date(formData.dob).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                    <p className="text-base capitalize">{formData.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                    <p className="text-base">{formData.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="text-base">{formData.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">State</h4>
                    <p className="text-base">{formData.state}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <p className="text-base">{formData.address}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Vehicle Type</h4>
                    <p className="text-base">{formData.vehicletype}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Vehicle Category</h4>
                    <p className="text-base">{formData.vehicleCategory}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Car Use</h4>
                    <p className="text-base">{formData.carUse}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Make</h4>
                    <p className="text-base">{formData.make}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                    <p className="text-base">{formData.model}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                    <p className="text-base">{formData.year_of_make}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Colour</h4>
                    <p className="text-base">{formData.colour}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Engine Capacity</h4>
                    <p className="text-base">{formData.engineCapacity}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">VIN Number</h4>
                    <p className="text-base">{formData.vinnumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Engine Number</h4>
                    <p className="text-base">{formData.engineNumber}</p>
                  </div>
                </div>
              </div>

              {/* Registration Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Registration Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Registration Type</h4>
                    <p className="text-base">{formData.registrationType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plate Number</h4>
                    <p className="text-base">{formData.platenumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plate Type</h4>
                    <p className="text-base">{formData.plate_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Certificate Type</h4>
                    <p className="text-base">{formData.certificatetype}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Insurance Provider</h4>
                    <p className="text-base">{formData.insurancename}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleBackToEdit}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <Button onClick={handleConfirmSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm & Pay {editFee}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
