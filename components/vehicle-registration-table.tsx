"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, Eye, Printer, Edit, Send } from "lucide-react"
import { FileText, Receipt, CreditCard, BookOpen, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RegistrationDetailsModal, type RegistrationDetails } from "./registration-details-modal"

// Generate mock data for 20 jobs
const generateMockJobs = (): VehicleRegistration[] => {
  const names = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Sarah Williams",
    "David Brown",
    "Emma Davis",
    "James Wilson",
    "Olivia Taylor",
    "Daniel Anderson",
    "Sophia Martinez",
    "Christopher Garcia",
    "Isabella Rodriguez",
    "Matthew Lopez",
    "Mia Hernandez",
    "Andrew Lee",
    "Charlotte Walker",
    "Joshua Hall",
    "Amelia Allen",
    "Ryan Young",
    "Harper King",
  ]

  const makes = ["Toyota", "Honda", "Ford", "Mercedes", "BMW", "Audi", "Nissan", "Hyundai", "Kia", "Volkswagen"]
  const types = ["New", "Renewal", "Re-Registration", "Change of Ownership"]

  return Array.from({ length: 20 }, (_, i) => ({
    id: `job-${String(i + 1).padStart(3, "0")}`,
    name: names[i],
    plate: `AGB${String(Math.floor(Math.random() * 900) + 100)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    type: types[Math.floor(Math.random() * types.length)],
    vehicleMake: makes[Math.floor(Math.random() * makes.length)],
    createdOn: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
  }))
}

// Define the data type for vehicle registrations
export type VehicleRegistration = {
  id: string
  name: string
  plate: string
  type: string
  vehicleMake: string
  createdOn: Date
}

// Sample registration details for demo
const sampleRegistrationDetails: RegistrationDetails = {
  id: "012d9ebc-b275-11ef-afb8-c2533074ef2a",
  name: "Henry",
  surname: "Chukwuka Lucky",
  dob: "1995-12-23",
  gender: "male",
  phone: "07068684876",
  email: "henry@qurulab.com",
  state: "Delta",
  address: "160, CONVENT STREET, B.B OWA DFELTA STATE",
  carUse: "Private",
  vehicleCategory: "Car",
  make: "Toyota",
  model: "Camry",
  colour: "Red",
  certificatetype: "pm",
  plate_type: "Normal",
  vinnumber: "4T1BE46K28U211890",
  engineNumber: "2AZ-2791716",
  engineCapacity: "1.6 - 2.0",
  insurancename: "GNI",
  year_of_make: "2000",
  created_at: "2024-05-08",
  created_by: "OGELEBOR OYAWBUGHA",
  updated_at: "2024-05-08",
  updated_by: "AdminUser",
  status: "approved",
  uid: "G77729127",
  registrationType: "Renewal",
  vehicletype: "Saloon Car",
  platenumber: "AGB888NY",
}

// Add a loadMore prop to the VehicleRegistrationTableProps interface
interface VehicleRegistrationTableProps {
  data: VehicleRegistration[]
  showOnlyNew?: boolean
  showOnlyRenewal?: boolean
  searchPlaceholder?: string
  searchQuery?: string
  isLoading?: boolean
  disablePagination?: boolean
  loadMore?: () => void
  hasMoreData?: boolean
  isLoadingMore?: boolean
}

// Update the function signature to include the new props
export function VehicleRegistrationTable({
  data,
  showOnlyNew = false,
  showOnlyRenewal = false,
  searchPlaceholder = "Search registrations...",
  searchQuery = "",
  isLoading = false,
  disablePagination = false,
  loadMore,
  hasMoreData = false,
  isLoadingMore = false,
}: VehicleRegistrationTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState(searchQuery)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false)
  const [selectedRegistration, setSelectedRegistration] = React.useState<RegistrationDetails | null>(null)
  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false)
  const [selectedJobForPrint, setSelectedJobForPrint] = React.useState<VehicleRegistration | null>(null)
  const [isRepushInsuranceModalOpen, setIsRepushInsuranceModalOpen] = React.useState(false)
  const [isPushCorrectionModalOpen, setIsPushCorrectionModalOpen] = React.useState(false)
  const [selectedJobForAction, setSelectedJobForAction] = React.useState<VehicleRegistration | null>(null)

  // Update global filter when searchQuery prop changes
  React.useEffect(() => {
    setGlobalFilter(searchQuery)
  }, [searchQuery])

  const handleViewDetails = (registration: VehicleRegistration) => {
    // In a real app, you would fetch the details from the API
    // For demo purposes, we'll use the sample data
    setSelectedRegistration(sampleRegistrationDetails)
    setIsDetailsModalOpen(true)
  }

  const handlePrintGMR = (registration: VehicleRegistration) => {
    setSelectedJobForPrint(registration)
    setIsPrintModalOpen(true)
  }

  const handleRepushInsurance = (registration: VehicleRegistration) => {
    setSelectedJobForAction(registration)
    setIsRepushInsuranceModalOpen(true)
  }

  const handlePushCorrection = (registration: VehicleRegistration) => {
    setSelectedJobForAction(registration)
    setIsPushCorrectionModalOpen(true)
  }

  // Define columns for the table
  const columns: ColumnDef<VehicleRegistration>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "plate",
      header: "Plate",
      cell: ({ row }) => <div className="font-medium">{row.getValue("plate")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        let textColor = "text-blue-600" // Default for Renewal
        let displayType = type

        // Format the type for display
        if (type && typeof type === "string") {
          // Convert to title case and handle specific cases
          displayType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()

          if (type.toLowerCase() === "new") {
            textColor = "text-green-600"
          } else if (type.toLowerCase() === "renewal") {
            textColor = "text-blue-600"
          } else if (type.toLowerCase() === "reregistration") {
            textColor = "text-purple-600"
            displayType = "Re-Registration"
          } else if (type.toLowerCase() === "changeofownership") {
            textColor = "text-orange-600"
            displayType = "Change of Ownership"
          }
        }

        return <div className={`font-medium ${textColor}`}>{displayType}</div>
      },
    },
    {
      accessorKey: "vehicleMake",
      header: "Vehicle Make",
      cell: ({ row }) => <div>{row.getValue("vehicleMake")}</div>,
    },
    {
      accessorKey: "createdOn",
      header: "Created On",
      cell: ({ row }) => {
        const date = row.getValue("createdOn") as Date
        return (
          <div>
            {date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const registration = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-dropdown">
              <DropdownMenuItem onClick={() => handleViewDetails(registration)}>
                <Eye className="mr-2 h-4 w-4" />
                View Job Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintGMR(registration)}>
                <Printer className="mr-2 h-4 w-4" />
                Print GMR
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRepushInsurance(registration)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                rePush Insurance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePushCorrection(registration)}>
                <Send className="mr-2 h-4 w-4" />
                Push Correction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Filter data based on type if needed, or use mock data if no data provided
  const filteredByTypeData = React.useMemo(() => {
    const dataToUse = data.length > 0 ? data : generateMockJobs()

    if (showOnlyNew) {
      return dataToUse.filter((item) => item.type.toLowerCase() === "new")
    }
    if (showOnlyRenewal) {
      return dataToUse.filter((item) => item.type.toLowerCase() === "renewal")
    }
    return dataToUse
  }, [data, showOnlyNew, showOnlyRenewal])

  // Set up the table
  const table = useReactTable({
    data: filteredByTypeData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: disablePagination ? Number.MAX_SAFE_INTEGER : 10,
      },
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-lg border border-border overflow-hidden shadow-card">
        <Table>
          <TableHeader className="bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="ml-2">Loading jobs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-accent hover:bg-primary-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!disablePagination ? (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            {disablePagination
              ? `Showing all ${table.getFilteredRowModel().rows.length} entries`
              : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )} of ${table.getFilteredRowModel().rows.length} entries`}
          </div>
          {!disablePagination && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-input hover:bg-accent"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === table.getState().pagination.pageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(i)}
                    className={
                      i === table.getState().pagination.pageIndex
                        ? "bg-primary hover:bg-primary-hover"
                        : "border-input hover:bg-accent"
                    }
                  >
                    {i + 1}
                  </Button>
                )).slice(
                  Math.max(0, table.getState().pagination.pageIndex - 2),
                  Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-input hover:bg-accent"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        loadMore && (
          <div className="flex justify-center py-4">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore || !hasMoreData}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              {isLoadingMore ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : hasMoreData ? (
                "Load More"
              ) : (
                "No More Jobs"
              )}
            </Button>
          </div>
        )
      )}

      {/* Registration Details Modal */}
      <RegistrationDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        details={selectedRegistration}
      />

      {/* Print Options Modal */}
      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Print Options</DialogTitle>
            <DialogDescription>
              Select the document type you want to print for {selectedJobForPrint?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12 text-left bg-transparent"
              onClick={() => {
                console.log("Printing Hackney for", selectedJobForPrint?.name)
                setIsPrintModalOpen(false)
              }}
            >
              <div className="bg-blue-100 rounded-md p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Hackney</div>
                <div className="text-sm text-muted-foreground">Commercial vehicle permit</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12 text-left bg-transparent"
              onClick={() => {
                console.log("Printing eRegistration Receipt for", selectedJobForPrint?.name)
                setIsPrintModalOpen(false)
              }}
            >
              <div className="bg-green-100 rounded-md p-2">
                <Receipt className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">eRegistration Receipt</div>
                <div className="text-sm text-muted-foreground">Digital registration receipt</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12 text-left bg-transparent"
              onClick={() => {
                console.log("Printing ePlate Number Receipt for", selectedJobForPrint?.name)
                setIsPrintModalOpen(false)
              }}
            >
              <div className="bg-purple-100 rounded-md p-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">ePlate Number Receipt</div>
                <div className="text-sm text-muted-foreground">Plate number assignment receipt</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12 text-left bg-transparent"
              onClick={() => {
                console.log("Printing Booklet Proof of Ownership for", selectedJobForPrint?.name)
                setIsPrintModalOpen(false)
              }}
            >
              <div className="bg-orange-100 rounded-md p-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Booklet Proof of Ownership</div>
                <div className="text-sm text-muted-foreground">Official ownership document</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12 text-left bg-transparent"
              onClick={() => {
                console.log("Printing Change of Ownership Receipt for", selectedJobForPrint?.name)
                setIsPrintModalOpen(false)
              }}
            >
              <div className="bg-red-100 rounded-md p-2">
                <RefreshCw className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">Change of Ownership Receipt</div>
                <div className="text-sm text-muted-foreground">Ownership transfer receipt</div>
              </div>
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* rePush Insurance Confirmation Modal */}
      <Dialog open={isRepushInsuranceModalOpen} onOpenChange={setIsRepushInsuranceModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm rePush Insurance</DialogTitle>
            <DialogDescription>
              Are you sure you want to rePush insurance for {selectedJobForAction?.name}?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Insurance rePush</h4>
                  <p className="text-sm text-blue-700">This will resend the insurance information to the system</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRepushInsuranceModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                console.log("rePushing insurance for", selectedJobForAction?.name)
                setIsRepushInsuranceModalOpen(false)
              }}
            >
              Confirm rePush
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Push Correction Confirmation Modal */}
      <Dialog open={isPushCorrectionModalOpen} onOpenChange={setIsPushCorrectionModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Push Correction</DialogTitle>
            <DialogDescription>
              Are you sure you want to push correction for {selectedJobForAction?.name}?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Push Correction</h4>
                  <p className="text-sm text-green-700">This will send correction data to update the job information</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPushCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                console.log("Pushing correction for", selectedJobForAction?.name)
                setIsPushCorrectionModalOpen(false)
              }}
            >
              Confirm Push
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
