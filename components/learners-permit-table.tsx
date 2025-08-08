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

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { LearnerPermitDetails } from "./learners-permit-details-modal"

interface LearnerPermitTableProps {
  data: LearnerPermitDetails[]
  onViewDetails: (details: LearnerPermitDetails) => void
  searchQuery?: string
}

export function LearnerPermitTable({
  data,
  onViewDetails,
  searchQuery: initialSearchQuery = "",
}: LearnerPermitTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery)

  // Update global filter when searchQuery prop changes
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery)
  }, [initialSearchQuery])

  // Define columns for the table
  const columns: ColumnDef<LearnerPermitDetails>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => <div>{row.getValue("route")}</div>,
    },
    {
      accessorKey: "issuanceDate",
      header: "Issuance Date",
      cell: ({ row }) => {
        const date = row.getValue("issuanceDate") as Date
        return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      },
    },
    {
      accessorKey: "issuedBy",
      header: "Issued By",
      cell: ({ row }) => <div>{row.getValue("issuedBy")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(row.original)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            View Details
          </Button>
        )
      },
    },
  ]

  // Set up the table
  const table = useReactTable({
    data,
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
      globalFilter: searchQuery,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  // Handle global search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    table.setGlobalFilter(e.target.value)
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
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
                className="w-8"
              >
                {i + 1}
              </Button>
            )).slice(
              Math.max(0, table.getState().pagination.pageIndex - 2),
              Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3),
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
