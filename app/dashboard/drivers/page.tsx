"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format, subDays } from "date-fns"
import { Car, Plus, Search, RefreshCw, UserPlus, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { type VehicleRegistration, VehicleRegistrationTable } from "@/components/vehicle-registration-table"
import { RegistrationFormModal } from "@/components/registration-form-modal"
import { SearchJobModal } from "@/components/search-job-modal"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { VehicleTypesModal } from "@/components/vehicle-types-modal"
import { Card } from "@/components/ui/card"
// Import the new service at the top
import { fetchRegistration } from "@/services/vehicle-registration-service"

// Mock data for vehicle types
const registrationVehicleTypes = [
  { type: "Jeep", count: 24 },
  { type: "Motorcycle", count: 38 },
  { type: "Tricycle", count: 17 },
  { type: "Bus", count: 12 },
  { type: "Saloon Car", count: 45 },
]

const renewalVehicleTypes = [
  { type: "Jeep", count: 18 },
  { type: "Motorcycle", count: 25 },
  { type: "Tricycle", count: 10 },
  { type: "Bus", count: 8 },
  { type: "Saloon Car", count: 32 },
]

const reRegistrationVehicleTypes = [
  { type: "Jeep", count: 12 },
  { type: "Motorcycle", count: 20 },
  { type: "Tricycle", count: 8 },
  { type: "Bus", count: 5 },
  { type: "Saloon Car", count: 22 },
]

const ownershipVehicleTypes = [
  { type: "Jeep", count: 5 },
  { type: "Motorcycle", count: 3 },
  { type: "Tricycle", count: 2 },
  { type: "Bus", count: 1 },
  { type: "Saloon Car", count: 8 },
]

export default function VehicleRegistrationPage() {
  // State for date range picker - set to one week ago till today
  const today = new Date()
  const oneWeekAgo = subDays(today, 7)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: oneWeekAgo,
    to: today,
  })

  // State for registration form modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State for search job modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const [activeModal, setActiveModal] = useState<string | null>(null)

  // State for search
  const [searchQuery, setSearchQuery] = useState("")

  // State for API data
  const [jobsData, setJobsData] = useState<VehicleRegistration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalJobs, setTotalJobs] = useState(0)

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    const fetchVehicleRegistrations = async () => {
      if (dateRange?.from && dateRange?.to) {
        setIsLoading(true)
        try {
          // Format dates for API
          const fromDate = format(dateRange.from, "yyyy-MM-dd")
          const toDate = format(dateRange.to, "yyyy-MM-dd")

          console.log(`Fetching vehicle registrations from ${fromDate} to ${toDate}`)

          // Use the new fetchRegistration service with "New" registration type
          const response = await fetchRegistration(1, 500, "New")
          console.log("Vehicle Registration API response:", response)

          // Check if response has data property that is an array
          const registrationsArray = response && Array.isArray(response.data) ? response.data : []

          console.log("Processed registrations array:", registrationsArray)

          if (registrationsArray.length > 0) {
            // Map API response to the format expected by the table
            const mappedData = registrationsArray.map((registration) => ({
              id: registration.id || `reg-${Math.random().toString(36).substr(2, 9)}`,
              name:
                registration.name && registration.surname
                  ? `${registration.name} ${registration.surname}`
                  : registration.name || "Unknown",
              plate: registration.platenumber || "N/A",
              type: registration.registrationType || "new",
              vehicleMake: registration.make || "Unknown",
              createdOn: registration.created_at ? new Date(registration.created_at) : new Date(),
            }))

            // Sort by createdOn date, newest first
            mappedData.sort((a, b) => b.createdOn.getTime() - a.createdOn.getTime())

            console.log("Mapped data for table:", mappedData)
            setJobsData(mappedData)
            setTotalJobs(mappedData.length)
          } else {
            console.log("No registrations found in response")
            setJobsData([])
            setTotalJobs(0)
          }
        } catch (error) {
          console.error("Error fetching vehicle registrations:", error)
          setJobsData([])
          setTotalJobs(0)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchVehicleRegistrations()
  }, [dateRange])

  // Format date range for display
  const dateRangeText =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      : "All time"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Manage Jobs</h2>
          <p className="text-muted-foreground">Create and manage vehicle registration jobs and track their progress</p>
        </div>
      </div>

      {/* Gradient Card */}
      <div className="gradient-card rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Manage Jobs</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white transition-all duration-150"
            >
              <Search className="mr-2 h-4 w-4" /> Search For Job
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white transition-all duration-150"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 rounded-md p-3">
                <Car className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration</p>
                <h3 className="text-3xl font-bold mt-1">2</h3>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <button
              onClick={() => setActiveModal("registration")}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              View vehicle types
            </button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 rounded-md p-3">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renewal</p>
                <h3 className="text-3xl font-bold mt-1">3</h3>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <button
              onClick={() => setActiveModal("renewal")}
              className="text-sm font-medium text-green-500 hover:underline"
            >
              View vehicle types
            </button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 rounded-md p-3">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Re-Registration</p>
                <h3 className="text-3xl font-bold mt-1">5</h3>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <button
              onClick={() => setActiveModal("reRegistration")}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              View vehicle types
            </button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 rounded-md p-3">
                <UserPlus className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Change of Ownership</p>
                <h3 className="text-3xl font-bold mt-1">1</h3>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <button
              onClick={() => setActiveModal("changeOfOwnership")}
              className="text-sm font-medium text-purple-500 hover:underline"
            >
              View vehicle types
            </button>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h3 className="text-lg font-medium">Job Management</h3>
        </div>

        <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 flex justify-end">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={(newRange) => {
              setDateRange(newRange)
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card">
        <VehicleRegistrationTable
          data={jobsData}
          showOnlyNew={true}
          searchPlaceholder="Search for any registration job"
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </div>

      {/* Vehicle Types Modals */}
      <VehicleTypesModal
        open={activeModal === "registration"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Registration"
        dateRange={dateRangeText}
        vehicleTypes={registrationVehicleTypes}
      />

      <VehicleTypesModal
        open={activeModal === "renewal"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Renewal"
        dateRange={dateRangeText}
        vehicleTypes={renewalVehicleTypes}
      />

      <VehicleTypesModal
        open={activeModal === "reRegistration"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Re-Registration"
        dateRange={dateRangeText}
        vehicleTypes={reRegistrationVehicleTypes}
      />

      <VehicleTypesModal
        open={activeModal === "changeOfOwnership"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Change of Ownership"
        dateRange={dateRangeText}
        vehicleTypes={ownershipVehicleTypes}
      />

      <RegistrationFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Search Job Modal */}
      <SearchJobModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </motion.div>
  )
}
