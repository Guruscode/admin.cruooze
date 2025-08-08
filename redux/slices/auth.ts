import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/auth.type";

export interface APIResponseObjectType {
  token: string;
  id: string;
  email: string;
  fullname: string;
  username: string;
  isAdmin: boolean;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  isVerified: boolean;
  avatar: string;
  cover: string;
  firebaseUid: string;
  kycStatus: string;
  age: number | null;
  bio: string | null;
  country: string | null;
  followersCount: number;
  followingCount: number;
  gender: string | null;
  isDeleted: boolean;
  occupation: string | null;
  postCount: number;
  referralCode: string;
}

interface AuthState {
  isAuthenticated: boolean;
  profile: APIResponseObjectType | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  profile: null,
  user: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, { payload }: PayloadAction<APIResponseObjectType>) => {
      state.isAuthenticated = true;
      state.profile = payload;
      state.user = {
        id: payload.id,
        firstname: "",
        lastname: "",
        fullname: payload.fullname,
        email: payload.email,
        role: payload.isAdmin ? "Admin" : "user",
        created_date: "",
        username: payload.username,
        gender: payload.gender || "",
        image_url: payload.avatar,
        kycStatus: payload.kycStatus || "pending",
        has_transaction_pin: false,
        date_of_birth: null,
        referral_code: payload.referralCode,
        phone: "",
      };
      state.loading = false;
      state.error = null;
    },
    authError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.isAuthenticated = false;
      state.loading = false;
    },
    logout: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.profile = null;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    fetchProfileSuccess: (state, { payload }: PayloadAction<APIResponseObjectType>) => {
      state.profile = payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { login, loginSuccess, authError, logout, logoutSuccess, fetchProfileSuccess } = authSlice.actions;

export default authSlice.reducer;