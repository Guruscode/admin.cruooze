"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, RefreshCw, Calendar, FileText, CheckCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LearnerPermit {
  id: string
  permitId: string
  applicantName: string
  email: string
  phone: string
  issueDate: Date
  expiryDate: Date
  status: "active" | "expired" | "pending"
}

// Mock data for learner permits
const mockPermits: LearnerPermit[] = [
  {
    id: "1",
    permitId: "LP001",
    applicantName: "John Doe",
    email: "john.doe@email.com",
    phone: "08012345678",
    issueDate: new Date("2024-01-15"),
    expiryDate: new Date("2024-07-15"),
    status: "active",
  },
  {
    id: "2",
    permitId: "LP002",
    applicantName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "08087654321",
    issueDate: new Date("2023-12-10"),
    expiryDate: new Date("2024-06-10"),
    status: "expired",
  },
  {
    id: "3",
    permitId: "LP003",
    applicantName: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "08098765432",
    issueDate: new Date("2024-02-20"),
    expiryDate: new Date("2024-08-20"),
    status: "active",
  },
  {
    id: "4",
    permitId: "LP004",
    applicantName: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "08076543210",
    issueDate: new Date("2024-03-05"),
    expiryDate: new Date("2024-09-05"),
    status: "active",
  },
  {
    id: "5",
    permitId: "LP005",
    applicantName: "David Brown",
    email: "david.brown@email.com",
    phone: "08065432109",
    issueDate: new Date("2023-11-20"),
    expiryDate: new Date("2024-05-20"),
    status: "expired",
  },
]

export default function LearnersPermitManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter permits based on search and status
  const filteredPermits = mockPermits.filter((permit) => {
    const matchesSearch =
      permit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.permitId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || permit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate metrics
  const totalPermits = mockPermits.length
  const activePermits = mockPermits.filter((p) => p.status === "active").length
  const expiredPermits = mockPermits.filter((p) => p.status === "expired").length

  // Pagination
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPermits = filteredPermits.slice(startIndex, endIndex)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">active</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">expired</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Learners Permit Management</h2>
          <p className="text-muted-foreground">Manage and track learners permits on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            TODAY
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">Update Price</Button>
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
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Permits</p>
              <p className="text-3xl font-bold">{activePermits}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expired Permits</p>
              <p className="text-3xl font-bold">{expiredPermits}</p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
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
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium text-muted-foreground">Permit ID</TableHead>
              <TableHead className="font-medium text-muted-foreground">Applicant Name</TableHead>
              <TableHead className="font-medium text-muted-foreground">Email</TableHead>
              <TableHead className="font-medium text-muted-foreground">Phone</TableHead>
              <TableHead className="font-medium text-muted-foreground">Issue Date</TableHead>
              <TableHead className="font-medium text-muted-foreground">Expiry Date</TableHead>
              <TableHead className="font-medium text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPermits.map((permit) => (
              <TableRow key={permit.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{permit.permitId}</TableCell>
                <TableCell>{permit.applicantName}</TableCell>
                <TableCell className="text-muted-foreground">{permit.email}</TableCell>
                <TableCell className="text-muted-foreground">{permit.phone}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(permit.issueDate)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(permit.expiryDate)}</TableCell>
                <TableCell>{getStatusBadge(permit.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredPermits.length)} of {filteredPermits.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
