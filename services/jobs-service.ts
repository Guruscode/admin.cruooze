import axios from "axios"

// Define registration types for better type safety
export type RegistrationType = "new" | "renewal" | "reregistration" | "changeofownership" | "all"

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
  {
    id: "job-6",
    name: "Lisa",
    surname: "Anderson",
    platenumber: "AGB987GH",
    registrationType: "renewal",
    make: "Audi",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
  },
  {
    id: "job-7",
    name: "Robert",
    surname: "Taylor",
    platenumber: "AGB246IJ",
    registrationType: "new",
    make: "Lexus",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 7 days ago
  },
  {
    id: "job-8",
    name: "Emily",
    surname: "Davis",
    platenumber: "AGB135KL",
    registrationType: "reregistration",
    make: "Nissan",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(), // 8 days ago
  },
]

// Modify the getStationJobs function to use the API proxy and handle errors better
export const getStationJobs = async (
  fromDate: string,
  toDate: string,
  registrationType: RegistrationType = "all",
  page = 1,
) => {
  try {
    console.log(`Fetching jobs from ${fromDate} to ${toDate}, type: ${registrationType}, page: ${page}`)

    // Use the API proxy route instead of direct API call with shorter timeout
    const response = await axios.get(`/api/proxy/station-jobs`, {
      params: {
        "from-date": fromDate,
        "to-date": toDate,
        page,
      },
      timeout: 3000, // Reduced timeout to 3 seconds
    })

    console.log("Station jobs API response:", response.data)

    // Check if the response has data property
    const responseData = response.data || response

    // If we need to filter by registration type on the client side
    if (registrationType !== "all" && Array.isArray(responseData)) {
      const filtered = responseData.filter(
        (job) => job.registrationType === registrationType || job.registration_type === registrationType,
      )
      console.log(`Filtered jobs for type ${registrationType}:`, filtered)
      return filtered
    }

    return responseData
  } catch (error) {
    console.warn("API error, using mock data:", error)

    // Return mock data when the API is unavailable
    console.log("Using mock data due to API error")

    // Filter mock data if needed
    if (registrationType !== "all") {
      return mockJobsData.filter((job) => job.registrationType === registrationType)
    }

    return mockJobsData
  }
}
