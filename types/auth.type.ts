export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserData {
  email: string
  password: string
  // Add other fields as needed (e.g., name, role)
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordData {
  email: string
  newPassword: string
}