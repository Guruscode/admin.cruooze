"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddNewPlateModal } from "@/components/add-new-plate-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for plates
const plates = [
  {
    id: "1",
    plateNumber: "ABC-123-XY",
    type: "Private",
    station: "Asaba Central",
    status: "Active",
    assignedTo: "John Doe",
    dateIssued: "2024-01-15",
    expiryDate: "2025-01-15",
  },
  {
    id: "2",
    plateNumber: "COM-456-ZA",
    type: "Commercial",
    station: "Warri Station",
    status: "Active",
    assignedTo: "Jane Smith",
    dateIssued: "2024-02-20",
    expiryDate: "2025-02-20",
  },
  {
    id: "3",
    plateNumber: "GOV-789-BC",
    type: "Government",
    station: "Asaba Central",
    status: "Expired",
    assignedTo: "Mike Johnson",
    dateIssued: "2023-03-10",
    expiryDate: "2024-03-10",
  },
  {
    id: "4",
    plateNumber: "PVT-321-DE",
    type: "Private",
    station: "Ughelli Station",
    status: "Suspended",
    assignedTo: "Sarah Wilson",
    dateIssued: "2024-04-05",
    expiryDate: "2025-04-05",
  },
  {
    id: "5",
    plateNumber: "TRK-654-FG",
    type: "Truck",
    station: "Warri Station",
    status: "Active",
    assignedTo: "David Brown",
    dateIssued: "2024-05-12",
    expiryDate: "2025-05-12",
  },
]

export default function ManagePlatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddPlateModalOpen, setIsAddPlateModalOpen] = useState(false)
  const [isPlateTypesModalOpen, setIsPlateTypesModalOpen] = useState(false)
  const [selectedPlateType, setSelectedPlateType] = useState("")

  const filteredPlates = plates.filter((plate) => {
    const matchesSearch =
      plate.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.station.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || plate.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === "all" || plate.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      Private: "bg-blue-100 text-blue-800",
      Commercial: "bg-purple-100 text-purple-800",
      Government: "bg-gray-100 text-gray-800",
      Truck: "bg-orange-100 text-orange-800",
    }

    return (
      <Badge className={`${colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"} hover:bg-current`}>
        {type}
      </Badge>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Manage Plates</h1>
          <p className="text-muted-foreground">
            Monitor and manage vehicle plate numbers across different types and stations
          </p>
        </div>
        <Button onClick={() => setIsAddPlateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Plate
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Plates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plates.length}</div>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => {
                setSelectedPlateType("Total")
                setIsPlateTypesModalOpen(true)
              }}
            >
              View More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Plates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {plates.filter((p) => p.status === "Active").length}
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => {
                setSelectedPlateType("Active")
                setIsPlateTypesModalOpen(true)
              }}
            >
              View More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired Plates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{plates.filter((p) => p.status === "Expired").length}</div>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => {
                setSelectedPlateType("Expired")
                setIsPlateTypesModalOpen(true)
              }}
            >
              View More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended Plates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {plates.filter((p) => p.status === "Suspended").length}
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => {
                setSelectedPlateType("Suspended")
                setIsPlateTypesModalOpen(true)
              }}
            >
              View More
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search plates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plate Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlates.map((plate) => (
                  <TableRow key={plate.id}>
                    <TableCell className="font-medium">{plate.plateNumber}</TableCell>
                    <TableCell>{getTypeBadge(plate.type)}</TableCell>
                    <TableCell>{plate.station}</TableCell>
                    <TableCell>{plate.assignedTo}</TableCell>
                    <TableCell>{getStatusBadge(plate.status)}</TableCell>
                    <TableCell>{plate.dateIssued}</TableCell>
                    <TableCell>{plate.expiryDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Plate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Suspend Plate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add New Plate Modal */}
      <AddNewPlateModal isOpen={isAddPlateModalOpen} onClose={() => setIsAddPlateModalOpen(false)} />

      {/* Plate Types Modal */}
      <Dialog open={isPlateTypesModalOpen} onOpenChange={setIsPlateTypesModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedPlateType} Plates Breakdown</DialogTitle>
            <p className="text-muted-foreground mt-1">Plate types and remaining balance information</p>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            {/* Plate Types Breakdown */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Plate Types</h3>
              {["Private", "Commercial", "Government", "Truck", "Motorcycle"].map((type) => {
                const count = plates.filter((p) => {
                  if (selectedPlateType === "Total") return p.type === type
                  return p.type === type && p.status === selectedPlateType
                }).length

                return (
                  <div key={type} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <span className="text-lg font-medium">{type}</span>
                    <span className="text-lg">{count} plates</span>
                  </div>
                )
              })}
            </div>

            {/* Remaining Balance */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Remaining Balance</h3>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Available Plate Numbers</span>
                  <span className="text-lg font-bold text-blue-600">1,244 remaining</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Based on current allocation and usage patterns</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setIsPlateTypesModalOpen(false)}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
