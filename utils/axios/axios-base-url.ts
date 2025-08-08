import axios from "axios"

const BaseConfig = axios.create({
  timeout: 30000, // 30 seconds timeout
})

// Add a request interceptor
BaseConfig.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first, then sessionStorage
    let token = localStorage.getItem("token")

    if (!token) {
      token = sessionStorage.getItem("token")
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor
BaseConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear both storage types
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("token")
      // Redirect to login page if needed
    }
    return Promise.reject(error)
  },
)

export default BaseConfig
