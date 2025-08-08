import axios from "axios"

export const fetchRegistration = async (page = 1, limit = 500, registrationType?: string, headers: object = {}) => {
  try {
    // Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    // Ensure the token is present
    if (!token) {
      console.warn("Authentication token is missing. Using mock data.")
      return getMockRegistrationData(registrationType)
    }

    // Construct the query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    // Add registrationType to query parameters if provided
    if (registrationType) {
      queryParams.append("registrationType", registrationType)
    }

    console.log(`Fetching vehicle registrations via proxy: /api/proxy/vehicle-registrations?${queryParams.toString()}`)

    // Use the proxy route instead of direct API call
    const response = await axios.get(`/api/proxy/vehicle-registrations?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    })

    console.log("Vehicle registration API response:", response.data)

    // If the response doesn't have data, return mock data
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn("API response doesn't contain valid data. Using mock data.")
      return getMockRegistrationData(registrationType)
    }

    return response.data
  } catch (error: any) {
    console.error("Vehicle registration fetch error:", error)
    // Return mock data when the API is unavailable
    return getMockRegistrationData(registrationType)
  }
}

// Function to generate mock registration data
function getMockRegistrationData(registrationType?: string) {
  // Create mock data that matches the expected format
  const mockData = {
    data: [
      {
        id: "c5a5c8ee-1812-4f69-96e5-6ba4cf5741df",
        name: "James",
        surname: "Madison",
        dob: "2000-02-02",
        gender: "male",
        phone: "08062265242",
        email: "onosokwesocial@gmail.com",
        state: "Delta",
        address: "123 Main Street",
        carUse: "Private",
        vehicleCategory: "Car",
        make: "Acura",
        model: "ILX",
        colour: "Corporate",
        certificatetype: "pm",
        plate_type: "Normal",
        vinnumber: "NIL",
        engineNumber: "NIL",
        engineCapacity: "2.1 - 3.0",
        insurancename: "GNI",
        year_of_make: "2026",
        created_at: "2025-01-22",
        created_by: "MLO Frontend-End ",
        updated_at: null,
        updated_by: "AdminUser",
        status: "approved",
        timart: null,
        uid: "G62803742",
        registrationType: registrationType || "New",
        vehicletype: "Saloon Car",
        pocby: "MVP0162803742",
        platenumber: "EFR220AH",
      },
      {
        id: "d6b6d9ff-2923-5f70-07f6-7cb5d6852eg",
        name: "Sarah",
        surname: "Johnson",
        dob: "1995-05-15",
        gender: "female",
        phone: "08123456789",
        email: "sarah.johnson@example.com",
        state: "Delta",
        address: "456 Oak Avenue",
        carUse: "Private",
        vehicleCategory: "Car",
        make: "Toyota",
        model: "Camry",
        colour: "Black",
        certificatetype: "pm",
        plate_type: "Normal",
        vinnumber: "4T1BF1FK5CU123456",
        engineNumber: "2AZ-FE123456",
        engineCapacity: "1.6 - 2.0",
        insurancename: "AIICO",
        year_of_make: "2022",
        created_at: "2025-01-23",
        created_by: "MLO Frontend-End",
        updated_at: null,
        updated_by: "AdminUser",
        status: "approved",
        timart: null,
        uid: "G62803743",
        registrationType: registrationType || "New",
        vehicletype: "Saloon Car",
        pocby: "MVP0162803743",
        platenumber: "EFR221AH",
      },
      {
        id: "e7c7e0gg-3034-6g81-18g7-8dc6e7963fh",
        name: "Michael",
        surname: "Brown",
        dob: "1988-10-20",
        gender: "male",
        phone: "08098765432",
        email: "michael.brown@example.com",
        state: "Delta",
        address: "789 Pine Street",
        carUse: "Commercial",
        vehicleCategory: "Car",
        make: "Honda",
        model: "Accord",
        colour: "Silver",
        certificatetype: "standard",
        plate_type: "Normal",
        vinnumber: "1HGCM82633A123456",
        engineNumber: "K24A4-123456",
        engineCapacity: "2.1 - 3.0",
        insurancename: "Leadway",
        year_of_make: "2023",
        created_at: "2025-01-24",
        created_by: "MLO Frontend-End",
        updated_at: null,
        updated_by: "AdminUser",
        status: "approved",
        timart: null,
        uid: "G62803744",
        registrationType: registrationType || "New",
        vehicletype: "Saloon Car",
        pocby: "MVP0162803744",
        platenumber: "EFR222AH",
      },
    ],
  }

  return mockData
}
