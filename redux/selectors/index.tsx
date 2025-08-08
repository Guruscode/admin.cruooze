import { RootState } from "@/redux/store"
import { User } from "@/type"

export interface AuthState {
  isAuthenticated: boolean
  profile: { token: string } | null
  user: User | null
  loading: boolean
  error: boolean
}

export const authSlice = (state: RootState) => state.auth
export const alertSlice = (state: RootState) => state.alert