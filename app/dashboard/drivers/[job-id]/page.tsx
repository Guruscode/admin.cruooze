"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, User, Car, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface JobDetails {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  gender: string
  plateNumber: string
  fileNumber: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  chassisNumber: string
  engineNumber: string
  registrationType: string
  certificateType: string
  plateType: string
  insuranceProvider: string
  engineCapacity: string
  vehicleUse: string
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

// Mock job details
const mockJobDetails: { [key: string]: JobDetails } = {
  "job-001": {
    id: "job-001",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "08012345678",
    address: "123 Main Street, Lagos State",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    plateNumber: "AGB123XY",
    fileNumber: "F2024001",
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    vehicleYear: "2020",
    vehicleColor: "Black",
    chassisNumber: "4T1BF1FK5CU123456",
    engineNumber: "2AZ-FE123456",
    registrationType: "New",
    certificateType: "PM",
    plateType: "Normal",
    insuranceProvider: "GNI",
    engineCapacity: "2.5L",
    vehicleUse: "Private",
    status: "Completed",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "Admin User",
    updatedAt: "2024-01-16T14:20:00Z",
    updatedBy: "System Admin",
  },
  "job-002": {
    id: "job-002",
    name: "Jane",
    surname: "Smith",
    email: "jane.smith@example.com",
    phone: "08087654321",
    address: "456 Oak Avenue, Abuja",
    dateOfBirth: "1985-08-22",
    gender: "Female",
    plateNumber: "AGB456ZX",
    fileNumber: "F2024002",
    vehicleMake: "Honda",
    vehicleModel: "Accord",
    vehicleYear: "2019",
    vehicleColor: "Silver",
    chassisNumber: "1HGCM82633A123456",
    engineNumber: "K24A4-123456",
    registrationType: "Renewal",
    certificateType: "Standard",
    plateType: "Normal",
    insuranceProvider: "AIICO",
    engineCapacity: "2.4L",
    vehicleUse: "Private",
    status: "In Progress",
    createdAt: "2024-01-14T09:15:00Z",
    createdBy: "Officer Smith",
    updatedAt: "2024-01-15T16:45:00Z",
    updatedBy: "Supervisor Jones",
  },
  "job-003": {
    id: "job-003",
    name: "Michael",
    surname: "Johnson",
    email: "michael.johnson@example.com",
    phone: "08098765432",
    address: "789 Pine Street, Port Harcourt",
    dateOfBirth: "1992-12-03",
    gender: "Male",
    plateNumber: "AGB789AB",
    fileNumber: "F2024003",
    vehicleMake: "Ford",
    vehicleModel: "Explorer",
    vehicleYear: "2021",
    vehicleColor: "Blue",
    chassisNumber: "1FM5K8D84MGA12345",
    engineNumber: "3.5L-V6-123456",
    registrationType: "Re-Registration",
    certificateType: "PM",
    plateType: "Custom",
    insuranceProvider: "Leadway",
    engineCapacity: "3.5L",
    vehicleUse: "Commercial",
    status: "Pending",
    createdAt: "2024-01-13T11:00:00Z",
    createdBy: "Agent Brown",
    updatedAt: "2024-01-14T13:30:00Z",
    updatedBy: "Manager Wilson",
  },
}

export default function JobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params["job-id"] as string
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchJobDetails = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const details = mockJobDetails[jobId]
      setJobDetails(details || null)
      setIsLoading(false)
    }

    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Not Found</h3>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/dashboard/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{jobDetails.fileNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Button variant="outline" onClick={() => router.push("/dashboard/jobs")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Job Details</h1>
            <p className="text-gray-600">File Number: {jobDetails.fileNumber}</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Edit className="mr-2 h-4 w-4" />
          Edit Job
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <Badge className={getStatusColor(jobDetails.status)}>{jobDetails.status}</Badge>
        <span className="text-sm text-gray-600">Last updated: {formatDate(jobDetails.updatedAt)}</span>
      </div>

      {/* Job Details Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="font-semibold">
                  {jobDetails.name} {jobDetails.surname}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="font-semibold">{jobDetails.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="font-semibold">{new Date(jobDetails.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="font-semibold">{jobDetails.phone}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="font-semibold">{jobDetails.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="font-semibold">{jobDetails.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Make & Model</label>
                <p className="font-semibold">
                  {jobDetails.vehicleMake} {jobDetails.vehicleModel}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Year</label>
                <p className="font-semibold">{jobDetails.vehicleYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Color</label>
                <p className="font-semibold">{jobDetails.vehicleColor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Engine Capacity</label>
                <p className="font-semibold">{jobDetails.engineCapacity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vehicle Use</label>
                <p className="font-semibold">{jobDetails.vehicleUse}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Plate Number</label>
                <p className="font-semibold">{jobDetails.plateNumber}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Chassis Number</label>
                <p className="font-semibold">{jobDetails.chassisNumber}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Engine Number</label>
                <p className="font-semibold">{jobDetails.engineNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Registration Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Type</label>
                <p className="font-semibold">{jobDetails.registrationType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Certificate Type</label>
                <p className="font-semibold">{jobDetails.certificateType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Plate Type</label>
                <p className="font-semibold">{jobDetails.plateType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Insurance Provider</label>
                <p className="font-semibold">{jobDetails.insuranceProvider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created By</label>
                <p className="font-semibold">{jobDetails.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated By</label>
                <p className="font-semibold">{jobDetails.updatedBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold">Job Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(jobDetails.updatedAt)}</p>
                  <p className="text-sm text-gray-500">by {jobDetails.updatedBy}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold">Job Created</p>
                  <p className="text-sm text-gray-600">{formatDate(jobDetails.createdAt)}</p>
                  <p className="text-sm text-gray-500">by {jobDetails.createdBy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
