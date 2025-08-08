"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  RefreshCw,
  Calendar,
  FileText,
  CheckCircle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  MoreHorizontal,
  Edit,
  Plus,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface LearnerPermit {
  id: string
  applicantName: string
  email: string
  phone: string
  issueDate: string
  expiryDate: string
  status: "active" | "expired"
}

interface NewPermitFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  stateOfOrigin: string
  vehicleClass: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
}

// Mock data for learners permits
const mockPermits: LearnerPermit[] = [
  {
    id: "LP001",
    applicantName: "John Doe",
    email: "john.doe@email.com",
    phone: "08012345678",
    issueDate: "2024-01-15",
    expiryDate: "2024-07-15",
    status: "active",
  },
  {
    id: "LP002",
    applicantName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "08087654321",
    issueDate: "2023-12-10",
    expiryDate: "2024-06-10",
    status: "expired",
  },
  {
    id: "LP003",
    applicantName: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "08098765432",
    issueDate: "2024-02-20",
    expiryDate: "2024-08-20",
    status: "active",
  },
  {
    id: "LP004",
    applicantName: "Emily Brown",
    email: "emily.brown@email.com",
    phone: "08023456789",
    issueDate: "2024-03-01",
    expiryDate: "2024-09-01",
    status: "active",
  },
  {
    id: "LP005",
    applicantName: "David Wilson",
    email: "david.wilson@email.com",
    phone: "08034567890",
    issueDate: "2023-11-25",
    expiryDate: "2024-05-25",
    status: "expired",
  },
  {
    id: "LP006",
    applicantName: "Jessica Lee",
    email: "jessica.lee@email.com",
    phone: "08045678901",
    issueDate: "2024-04-10",
    expiryDate: "2024-10-10",
    status: "active",
  },
  {
    id: "LP007",
    applicantName: "Kevin Garcia",
    email: "kevin.garcia@email.com",
    phone: "08056789012",
    issueDate: "2023-10-15",
    expiryDate: "2024-04-15",
    status: "expired",
  },
  {
    id: "LP008",
    applicantName: "Ashley Rodriguez",
    email: "ashley.rodriguez@email.com",
    phone: "08067890123",
    issueDate: "2024-05-01",
    expiryDate: "2024-11-01",
    status: "active",
  },
  {
    id: "LP009",
    applicantName: "Brandon Martinez",
    email: "brandon.martinez@email.com",
    phone: "08078901234",
    issueDate: "2023-09-20",
    expiryDate: "2024-03-20",
    status: "expired",
  },
  {
    id: "LP010",
    applicantName: "Sarah Hernandez",
    email: "sarah.hernandez@email.com",
    phone: "08089012345",
    issueDate: "2024-06-10",
    expiryDate: "2024-12-10",
    status: "active",
  },
  {
    id: "LP011",
    applicantName: "Justin Lopez",
    email: "justin.lopez@email.com",
    phone: "08090123456",
    issueDate: "2023-08-15",
    expiryDate: "2024-02-15",
    status: "expired",
  },
  {
    id: "LP012",
    applicantName: "Brittany Gonzalez",
    email: "brittany.gonzalez@email.com",
    phone: "08001234567",
    issueDate: "2024-07-01",
    expiryDate: "2025-01-01",
    status: "active",
  },
  {
    id: "LP013",
    applicantName: "Nicholas Perez",
    email: "nicholas.perez@email.com",
    phone: "08012345679",
    issueDate: "2023-07-20",
    expiryDate: "2024-01-20",
    status: "expired",
  },
  {
    id: "LP014",
    applicantName: "Megan Sanchez",
    email: "megan.sanchez@email.com",
    phone: "08023456790",
    issueDate: "2024-08-10",
    expiryDate: "2025-02-10",
    status: "active",
  },
  {
    id: "LP015",
    applicantName: "Tyler Ramirez",
    email: "tyler.ramirez@email.com",
    phone: "08034567901",
    issueDate: "2023-06-15",
    expiryDate: "2023-12-15",
    status: "expired",
  },
]

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

const vehicleClasses = [
  { value: "A", label: "Class A - Motorcycles" },
  { value: "B", label: "Class B - Cars and Light Vehicles" },
  { value: "C", label: "Class C - Medium Trucks" },
  { value: "D", label: "Class D - Heavy Trucks and Buses" },
  { value: "E", label: "Class E - Articulated Vehicles" },
]

export default function LearnersPermitPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newPermitModalOpen, setNewPermitModalOpen] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<LearnerPermit | null>(null)
  const [editFormData, setEditFormData] = useState<LearnerPermit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPermitForm, setNewPermitForm] = useState<NewPermitFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    stateOfOrigin: "",
    vehicleClass: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })
  const permitsPerPage = 10

  // Filter permits based on search and status
  const filteredPermits = mockPermits.filter((permit) => {
    const matchesSearch =
      permit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || permit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate metrics
  const totalPermits = 1234
  const activePermits = 987
  const expiredPermits = 247

  const totalPages = Math.ceil(filteredPermits.length / permitsPerPage)
  const paginatedPermits = filteredPermits.slice((currentPage - 1) * permitsPerPage, currentPage * permitsPerPage)

  const handleView = (permit: LearnerPermit) => {
    setSelectedPermit(permit)
    setViewModalOpen(true)
  }

  const handleEdit = (permit: LearnerPermit) => {
    setEditFormData({ ...permit })
    setEditModalOpen(true)
  }

  const handleEditSubmit = () => {
    // Handle edit submission logic here
    setEditModalOpen(false)
    setEditFormData(null)
  }

  const handleNewPermitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setNewPermitModalOpen(false)
    setNewPermitForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      stateOfOrigin: "",
      vehicleClass: "",
      medicalConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    })
  }

  const updateNewPermitForm = (field: keyof NewPermitFormData, value: string) => {
    setNewPermitForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learners Permit Management</h1>
          <p className="text-muted-foreground">Manage and track learners permits on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            TODAY
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
            onClick={() => setNewPermitModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Learners Permit
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Learners Permit</p>
              <p className="text-3xl font-bold">{totalPermits.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Permits</p>
              <p className="text-3xl font-bold">{activePermits.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expired Permits</p>
              <p className="text-3xl font-bold">{expiredPermits.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or permit ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Permit ID</TableHead>
              <TableHead className="font-semibold">Applicant Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Issue Date</TableHead>
              <TableHead className="font-semibold">Expiry Date</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPermits.map((permit) => (
              <TableRow key={permit.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{permit.id}</TableCell>
                <TableCell>{permit.applicantName}</TableCell>
                <TableCell className="text-muted-foreground">{permit.email}</TableCell>
                <TableCell>{permit.phone}</TableCell>
                <TableCell>{permit.issueDate}</TableCell>
                <TableCell>{permit.expiryDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(permit)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(permit)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * permitsPerPage + 1} to{" "}
          {Math.min(currentPage * permitsPerPage, filteredPermits.length)} of {filteredPermits.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Learner's Permit Details</DialogTitle>
            <DialogDescription>View complete details for permit {selectedPermit?.id}</DialogDescription>
          </DialogHeader>
          {selectedPermit && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Permit ID</Label>
                <p className="font-medium">{selectedPermit.id}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge
                  variant={selectedPermit.status === "active" ? "default" : "destructive"}
                  className={selectedPermit.status === "active" ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  {selectedPermit.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Applicant Name</Label>
                <p className="font-medium">{selectedPermit.applicantName}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <p className="font-medium">{selectedPermit.phone}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs text-muted-foreground">Email Address</Label>
                <p className="font-medium">{selectedPermit.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Issue Date</Label>
                <p className="font-medium">{selectedPermit.issueDate}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                <p className="font-medium">{selectedPermit.expiryDate}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Printer className="mr-2 h-4 w-4" />
              Print Permit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Learner's Permit</DialogTitle>
            <DialogDescription>Update the details for permit {editFormData?.id}</DialogDescription>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input
                    id="applicantName"
                    value={editFormData.applicantName}
                    onChange={(e) => setEditFormData({ ...editFormData, applicantName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={editFormData.issueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, issueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: "active" | "expired") => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  <strong>Edit Fee: ₦2,500</strong>
                  <br />
                  Please ensure you have sufficient funds in your wallet before proceeding with the edit.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="bg-blue-500 hover:bg-blue-600">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Learners Permit Modal */}
      <Dialog open={newPermitModalOpen} onOpenChange={setNewPermitModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Learner's Permit Application</DialogTitle>
            <DialogDescription>Fill out the form below to create a new learner's permit application.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPermitSubmit} className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={newPermitForm.firstName}
                    onChange={(e) => updateNewPermitForm("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={newPermitForm.lastName}
                    onChange={(e) => updateNewPermitForm("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPermitForm.email}
                    onChange={(e) => updateNewPermitForm("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newPermitForm.phone}
                    onChange={(e) => updateNewPermitForm("phone", e.target.value)}
                    placeholder="08012345678"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newPermitForm.dateOfBirth}
                    onChange={(e) => updateNewPermitForm("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={newPermitForm.gender}
                    onValueChange={(value) => updateNewPermitForm("gender", value)}
                    className="flex gap-4 pt-2"
                  >
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
                <Label htmlFor="address">Residential Address *</Label>
                <Textarea
                  id="address"
                  value={newPermitForm.address}
                  onChange={(e) => updateNewPermitForm("address", e.target.value)}
                  placeholder="Enter your full residential address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stateOfOrigin">State of Origin *</Label>
                <Select
                  value={newPermitForm.stateOfOrigin}
                  onValueChange={(value) => updateNewPermitForm("stateOfOrigin", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state of origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="space-y-2">
                <Label htmlFor="vehicleClass">Vehicle Class *</Label>
                <Select
                  value={newPermitForm.vehicleClass}
                  onValueChange={(value) => updateNewPermitForm("vehicleClass", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle class" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleClasses.map((vehicleClass) => (
                      <SelectItem key={vehicleClass.value} value={vehicleClass.value}>
                        {vehicleClass.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={newPermitForm.medicalConditions}
                  onChange={(e) => updateNewPermitForm("medicalConditions", e.target.value)}
                  placeholder="List any medical conditions that may affect driving (optional)"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={newPermitForm.emergencyContactName}
                    onChange={(e) => updateNewPermitForm("emergencyContactName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={newPermitForm.emergencyContactPhone}
                    onChange={(e) => updateNewPermitForm("emergencyContactPhone", e.target.value)}
                    placeholder="08012345678"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fee Information */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>Application Fee: ₦15,000</strong>
                <br />
                This fee covers the processing and issuance of your learner's permit. Please ensure you have sufficient
                funds in your wallet.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewPermitModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
