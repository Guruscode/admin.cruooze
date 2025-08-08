"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface SearchJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResult {
  id: string
  name: string
  plateNumber: string
  fileNumber: string
  phoneNumber: string
  vehicleMake: string
  registrationType: string
  status: string
}

// Mock search results
const mockSearchResults: SearchResult[] = [
  {
    id: "job-001",
    name: "John Doe",
    plateNumber: "AGB123XY",
    fileNumber: "F2024001",
    phoneNumber: "08012345678",
    vehicleMake: "Toyota",
    registrationType: "New",
    status: "Completed",
  },
  {
    id: "job-002",
    name: "Jane Smith",
    plateNumber: "AGB456ZX",
    fileNumber: "F2024002",
    phoneNumber: "08087654321",
    vehicleMake: "Honda",
    registrationType: "Renewal",
    status: "In Progress",
  },
  {
    id: "job-003",
    name: "Michael Johnson",
    plateNumber: "AGB789AB",
    fileNumber: "F2024003",
    phoneNumber: "08098765432",
    vehicleMake: "Ford",
    registrationType: "Re-Registration",
    status: "Pending",
  },
]

export function SearchJobModal({ open, onOpenChange }: SearchJobModalProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter mock results based on search type and value
    const filteredResults = mockSearchResults.filter((result) => {
      const searchTerm = searchValue.toLowerCase()
      return (
        result.fileNumber.toLowerCase().includes(searchTerm) ||
        result.plateNumber.toLowerCase().includes(searchTerm) ||
        result.phoneNumber.includes(searchTerm) ||
        result.name.toLowerCase().includes(searchTerm)
      )
    })

    setSearchResults(filteredResults)
    setShowResults(true)
    setIsSearching(false)
  }

  const handleResultClick = (jobId: string) => {
    onOpenChange(false)
    router.push(`/dashboard/jobs/${jobId}`)
  }

  const resetSearch = () => {
    setSearchValue("")
    setSearchResults([])
    setShowResults(false)
  }

  const handleClose = () => {
    resetSearch()
    onOpenChange(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search For Job
          </DialogTitle>
          <DialogDescription>Enter any of the search parameters below to find specific jobs</DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="w-full space-y-2">
                  <Label htmlFor="searchValue">Search Value</Label>
                  <Input
                    id="searchValue"
                    placeholder="Enter search value (file number, plate number, phone number, etc.)"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchValue.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
              <Button variant="outline" size="sm" onClick={resetSearch}>
                New Search
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <div className="space-y-3">
                {[
                  {
                    id: "job-001",
                    name: "John Doe",
                    plateNumber: "AGB123XY",
                    fileNumber: "F2024001",
                    phoneNumber: "08012345678",
                    vehicleMake: "Toyota",
                    registrationType: "New",
                    status: "Completed",
                  },
                  {
                    id: "job-002",
                    name: "Jane Smith",
                    plateNumber: "AGB456ZX",
                    fileNumber: "F2024002",
                    phoneNumber: "08087654321",
                    vehicleMake: "Honda",
                    registrationType: "Renewal",
                    status: "In Progress",
                  },
                  {
                    id: "job-003",
                    name: "Michael Johnson",
                    plateNumber: "AGB789AB",
                    fileNumber: "F2024003",
                    phoneNumber: "08098765432",
                    vehicleMake: "Ford",
                    registrationType: "Re-Registration",
                    status: "Pending",
                  },
                ].map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Plate:</span> {result.plateNumber}
                      </div>
                      <div>
                        <span className="font-medium">File:</span> {result.fileNumber}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {result.phoneNumber}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {result.registrationType}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Vehicle:</span> {result.vehicleMake}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Plate:</span> {result.plateNumber}
                      </div>
                      <div>
                        <span className="font-medium">File:</span> {result.fileNumber}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {result.phoneNumber}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {result.registrationType}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Vehicle:</span> {result.vehicleMake}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
