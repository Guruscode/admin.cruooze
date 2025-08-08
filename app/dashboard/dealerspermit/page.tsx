"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid3X3,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export default function DealersPermitPage() {
  const [totalPermits, setTotalPermits] = useState(50)
  const [activePermits, setActivePermits] = useState(30)
  const [expiredPermits, setExpiredPermits] = useState(20)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [permitsPerPage] = useState(5)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [newPermitModalOpen, setNewPermitModalOpen] = useState(false)

  const [selectedPermit, setSelectedPermit] = useState(null)

  const permits = [
    {
      id: "DP001",
      dealerName: "ABC Motors",
      contactPerson: "John Doe",
      phone: "123-456-7890",
      issueDate: "2023-01-01",
      expiryDate: "2024-01-01",
      status: "active",
    },
    {
      id: "DP002",
      dealerName: "XYZ Auto",
      contactPerson: "Jane Smith",
      phone: "987-654-3210",
      issueDate: "2023-02-15",
      expiryDate: "2024-02-15",
      status: "expired",
    },
    {
      id: "DP003",
      dealerName: "PQR Vehicles",
      contactPerson: "Mike Johnson",
      phone: "555-123-4567",
      issueDate: "2023-03-20",
      expiryDate: "2024-03-20",
      status: "active",
    },
    {
      id: "DP004",
      dealerName: "LMN Cars",
      contactPerson: "Emily Brown",
      phone: "111-222-3333",
      issueDate: "2023-04-01",
      expiryDate: "2024-04-01",
      status: "active",
    },
    {
      id: "DP005",
      dealerName: "UVW Motors",
      contactPerson: "David Wilson",
      phone: "444-555-6666",
      issueDate: "2023-05-10",
      expiryDate: "2024-05-10",
      status: "expired",
    },
    {
      id: "DP006",
      dealerName: "GHI Auto",
      contactPerson: "Sarah Lee",
      phone: "777-888-9999",
      issueDate: "2023-06-25",
      expiryDate: "2024-06-25",
      status: "active",
    },
    {
      id: "DP007",
      dealerName: "RST Vehicles",
      contactPerson: "Kevin Davis",
      phone: "333-444-5555",
      issueDate: "2023-07-01",
      expiryDate: "2024-07-01",
      status: "active",
    },
    {
      id: "DP008",
      dealerName: "OPQ Cars",
      contactPerson: "Ashley White",
      phone: "666-777-8888",
      issueDate: "2023-08-15",
      expiryDate: "2024-08-15",
      status: "expired",
    },
    {
      id: "DP009",
      dealerName: "JKL Motors",
      contactPerson: "Brian Hall",
      phone: "222-333-4444",
      issueDate: "2023-09-20",
      expiryDate: "2024-09-20",
      status: "active",
    },
    {
      id: "DP010",
      dealerName: "MNO Auto",
      contactPerson: "Jessica Green",
      phone: "888-999-0000",
      issueDate: "2023-10-01",
      expiryDate: "2024-10-01",
      status: "active",
    },
    {
      id: "DP011",
      dealerName: "DEF Vehicles",
      contactPerson: "Ryan King",
      phone: "999-000-1111",
      issueDate: "2023-11-10",
      expiryDate: "2024-11-10",
      status: "expired",
    },
    {
      id: "DP012",
      dealerName: "GHI Cars",
      contactPerson: "Megan Wright",
      phone: "000-111-2222",
      issueDate: "2023-12-25",
      expiryDate: "2024-12-25",
      status: "active",
    },
  ]

  const handleRefresh = () => {
    alert("Refreshing data...")
  }

  const handleToday = () => {
    alert("Navigating to today's date...")
  }

  const handleNewDealersPermit = () => {
    setNewPermitModalOpen(true)
  }

  const handleView = (permit) => {
    setSelectedPermit(permit)
    setViewModalOpen(true)
  }

  const handlePrint = (permit) => {
    setSelectedPermit(permit)
    setPrintModalOpen(true)
  }

  const handleDelete = (permit) => {
    setSelectedPermit(permit)
    setDeleteModalOpen(true)
  }

  const filteredPermits = permits
    .filter((permit) => {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        permit.dealerName.toLowerCase().includes(searchTermLower) ||
        permit.contactPerson.toLowerCase().includes(searchTermLower) ||
        permit.id.toLowerCase().includes(searchTermLower)
      )
    })
    .filter((permit) => {
      if (statusFilter === "all") return true
      return permit.status === statusFilter
    })

  const indexOfLastPermit = currentPage * permitsPerPage
  const indexOfFirstPermit = indexOfLastPermit - permitsPerPage
  const currentPermits = filteredPermits.slice(indexOfFirstPermit, indexOfLastPermit)

  const totalPages = Math.ceil(filteredPermits.length / permitsPerPage)
  const startIndex = indexOfFirstPermit
  const endIndex = indexOfLastPermit

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dealers Permit Management</h1>
          <p className="text-muted-foreground">Manage and track dealers permits on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            <Calendar className="h-4 w-4 mr-2" />
            TODAY
          </Button>
          <Button size="sm" onClick={handleNewDealersPermit}>
            New Dealers Permit
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dealers Permit</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPermits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Permits</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePermits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Permits</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by dealer name, contact person, email, or permit ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All" />
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permit ID</TableHead>
                <TableHead>Dealer Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPermits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-medium">{permit.id}</TableCell>
                  <TableCell>{permit.dealerName}</TableCell>
                  <TableCell>{permit.contactPerson}</TableCell>
                  <TableCell>{permit.phone}</TableCell>
                  <TableCell>{permit.issueDate}</TableCell>
                  <TableCell>{permit.expiryDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={permit.status === "active" ? "default" : "destructive"}
                      className={permit.status === "active" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                    >
                      {permit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(permit)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrint(permit)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(permit)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredPermits.length)} of {filteredPermits.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* All the existing modals remain the same */}
      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dealer Permit Details</DialogTitle>
          </DialogHeader>
          {selectedPermit && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Permit ID</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Dealer Name</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.dealerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Person</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.issueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <p className="text-sm text-muted-foreground">{selectedPermit.expiryDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={printModalOpen} onOpenChange={setPrintModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Dealer Permit</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to print this dealer permit?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Printing permit:", selectedPermit)
                setPrintModalOpen(false)
              }}
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dealer Permit</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this dealer permit? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Deleting permit:", selectedPermit)
                setDeleteModalOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Dealers Permit Modal */}
      <Dialog open={newPermitModalOpen} onOpenChange={setNewPermitModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Dealers Permit</DialogTitle>
          </DialogHeader>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Enter dealer name" />
              </div>
              <div>
                <label className="text-sm font-medium">Surname</label>
                <Input placeholder="Enter surname" />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="Enter phone number" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <Input placeholder="Enter state" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Enter full address" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewPermitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Permit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
