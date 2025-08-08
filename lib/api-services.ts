import api from "./axios"

// User related API services
export const userService = {
  // Login user
  login: (email: string, password: string) => {
    return api.post("/api/proxy/login", { email, password })
  },

  // Get user profile
  getProfile: () => {
    return api.get("/api/proxy/users/profile")
  },

  // Update user profile
  updateProfile: (userData: any) => {
    return api.put("/api/proxy/users/profile", userData)
  },
}

// Vehicle registration related API services
export const vehicleService = {
  // Get all registrations
  getAllRegistrations: (params?: any) => {
    return api.get("/vehicles/registrations", { params })
  },

  // Get registration by ID
  getRegistrationById: (id: string) => {
    return api.get(`/vehicles/registrations/${id}`)
  },

  // Create new registration
  createRegistration: (registrationData: any) => {
    return api.post("/vehicles/registrations", registrationData)
  },

  // Update registration
  updateRegistration: (id: string, registrationData: any) => {
    return api.put(`/vehicles/registrations/${id}`, registrationData)
  },
}

// Learner's permit related API services
export const learnerPermitService = {
  // Get all permits
  getAllPermits: (params?: any) => {
    return api.get("/permits", { params })
  },

  // Get permit by ID
  getPermitById: (id: string) => {
    return api.get(`/permits/${id}`)
  },

  // Create new permit
  createPermit: (permitData: any) => {
    return api.post("/permits", permitData)
  },
}

// Dashboard related API services
export const dashboardService = {
  // Get dashboard statistics
  getStatistics: () => {
    return api.get("/dashboard/statistics")
  },

  // Get recent activities
  getRecentActivities: () => {
    return api.get("/dashboard/activities")
  },
}
