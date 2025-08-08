import axios from "axios"

// Create an Axios instance with default configuration
const api = axios.create({
  // Use relative URL for the base to avoid CORS issues
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first, then sessionStorage
    let token = localStorage.getItem("token")

    if (!token) {
      token = sessionStorage.getItem("token")
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Added auth token to request")
    } else {
      console.log("No auth token found for request")
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.data)

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear auth data and redirect to login if needed
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Request Error:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api
