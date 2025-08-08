import { type NextRequest, NextResponse } from "next/server"

// Mock data for when the API is unavailable
const mockJobsData = [
  {
    id: "job-1",
    name: "John Doe",
    surname: "Smith",
    platenumber: "AGB123XY",
    registrationType: "new",
    make: "Toyota",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
  },
  {
    id: "job-2",
    name: "Jane",
    surname: "Wilson",
    platenumber: "AGB456ZX",
    registrationType: "renewal",
    make: "Honda",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: "job-3",
    name: "Michael",
    surname: "Johnson",
    platenumber: "AGB789AB",
    registrationType: "reregistration",
    make: "Ford",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: "job-4",
    name: "Sarah",
    surname: "Brown",
    platenumber: "AGB321CD",
    registrationType: "changeofownership",
    make: "Mercedes",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  },
  {
    id: "job-5",
    name: "David",
    surname: "Miller",
    platenumber: "AGB654EF",
    registrationType: "new",
    make: "BMW",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
  },
]

export async function GET(request: NextRequest) {
  try {
    // Get the URL parameters
    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get("from-date")
    const toDate = searchParams.get("to-date")
    const page = searchParams.get("page") || "1"

    // Get the authorization token from the request headers
    const authHeader = request.headers.get("Authorization") || ""

    // For development/testing, return mock data
    console.log("Returning mock station jobs data")
    return NextResponse.json(mockJobsData)

    /* Commented out actual API call for now
    // Forward the request to the correct API endpoint
    const response = await axios.get(
      `https://api.Cruooze.com.ng/users/station-jobs/all?from-date=${fromDate}&to-date=${toDate}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        timeout: 5000, // 5 second timeout
      },
    )

    // Return the API response
    return NextResponse.json(response.data)
    */
  } catch (error) {
    console.error("API proxy error:", error)

    // Return mock data on error
    return NextResponse.json(mockJobsData)
  }
}
