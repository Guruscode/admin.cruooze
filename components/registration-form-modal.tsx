"use client"

import type * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock data for vehicle makes
const vehicleMakes = [
  { label: "Toyota", value: "toyota" },
  { label: "Honda", value: "honda" },
  { label: "Ford", value: "ford" },
  { label: "Mercedes-Benz", value: "mercedes" },
  { label: "BMW", value: "bmw" },
  { label: "Audi", value: "audi" },
  { label: "Volkswagen", value: "volkswagen" },
  { label: "Nissan", value: "nissan" },
  { label: "Hyundai", value: "hyundai" },
  { label: "Kia", value: "kia" },
]

// Mock data for states
const states = [
  { label: "Delta", value: "delta" },
  { label: "Lagos", value: "lagos" },
  { label: "Abuja", value: "abuja" },
  { label: "Rivers", value: "rivers" },
  { label: "Kano", value: "kano" },
]

// Mock data for vehicle types
const vehicleTypes = [
  { label: "Saloon Car", value: "saloon" },
  { label: "SUV", value: "suv" },
  { label: "Truck", value: "truck" },
  { label: "Bus", value: "bus" },
  { label: "Motorcycle", value: "motorcycle" },
]

// Mock data for insurance providers
const insuranceProviders = [
  { label: "GNI", value: "gni" },
  { label: "AIICO", value: "aiico" },
  { label: "Leadway", value: "leadway" },
  { label: "AXA Mansard", value: "axa" },
  { label: "Cornerstone", value: "cornerstone" },
]

// Mock data for engine capacities
const engineCapacities = [
  { label: "Below 1.6", value: "below_1.6" },
  { label: "1.6 - 2.0", value: "1.6_2.0" },
  { label: "2.1 - 3.0", value: "2.1_3.0" },
  { label: "Above 3.0", value: "above_3.0" },
]

interface RegistrationFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistrationFormModal({ open, onOpenChange }: RegistrationFormModalProps) {
  const [activeTab, setActiveTab] = useState("owner")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openVehicleMake, setOpenVehicleMake] = useState(false)
  const [vehicleMake, setVehicleMake] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Vehicle Registration</DialogTitle>
          <DialogDescription>
            Enter the details for the new vehicle registration. Fill all required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="owner">Owner Details</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
              <TabsTrigger value="registration">Registration Info</TabsTrigger>
            </TabsList>
            <TabsContent value="owner" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input id="surname" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup defaultValue="male" className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="08012345678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main Street, City" required />
              </div>
              <Button type="button" onClick={() => setActiveTab("vehicle")} className="w-full">
                Next: Vehicle Details
              </Button>
            </TabsContent>
            <TabsContent value="vehicle" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleCategory">Vehicle Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carUse">Car Use</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Make</Label>
                  <Popover open={openVehicleMake} onOpenChange={setOpenVehicleMake}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openVehicleMake}
                        className="w-full justify-between"
                      >
                        {vehicleMake
                          ? vehicleMakes.find((make) => make.value === vehicleMake)?.label
                          : "Select vehicle make..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search vehicle make..." />
                        <CommandList>
                          <CommandEmpty>No vehicle make found.</CommandEmpty>
                          <CommandGroup>
                            {vehicleMakes.map((make) => (
                              <CommandItem
                                key={make.value}
                                value={make.value}
                                onSelect={(currentValue) => {
                                  setVehicleMake(currentValue === vehicleMake ? "" : currentValue)
                                  setOpenVehicleMake(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    vehicleMake === make.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {make.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Camry" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Make</Label>
                  <Input id="year" placeholder="2023" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Colour</Label>
                  <Input id="color" placeholder="Red" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineCapacity">Engine Capacity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineCapacities.map((capacity) => (
                        <SelectItem key={capacity.value} value={capacity.value}>
                          {capacity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vinNumber">VIN Number</Label>
                  <Input id="vinNumber" placeholder="4T1BE46K28U211890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineNumber">Engine Number</Label>
                  <Input id="engineNumber" placeholder="2AZ-2791716" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("owner")} className="w-full">
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("registration")} className="w-full">
                  Next: Registration Info
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="registration" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationType">Registration Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plateType">Plate Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateType">Certificate Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm">PM</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceName">Insurance Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number (for renewals)</Label>
                <Input id="plateNumber" placeholder="AGB888NY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" placeholder="25,000.00" readOnly />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("vehicle")} className="w-full">
                  Back
                </Button>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  )
}
