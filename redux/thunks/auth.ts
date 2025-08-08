import { AppThunk } from "../store";
import { useToast } from "@/hooks/use-toast";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { signInService, fetchUser } from "@/services/auth";
import { addCookies, clearCookies } from "../../utils/helpers";
import { loading, authError, loginSuccess, loggedInUser, logoutSuccess, logout } from "../slices/auth";

const { showSuccess, showError } = useToast();

export const loginUser = (email: string, password: string, router: any, keepSignedIn: boolean = false): AppThunk => async (dispatch: any) => {
  try {
    dispatch(loading());
    const response = await signInService(email, password);
    console.log('signInService Response:', response);
    if (!response || response.status === false) {
      const errorMessage = response?.message || "An Error Occurred, Try again later";
      showError(capitalizeFirstLetter(errorMessage));
      dispatch(authError());
      return;
    }

    if (response.data.user.role?.toLowerCase() !== 'admin') {
      showError("Access Denied: Only admin users can log in.");
      dispatch(authError());
      return;
    }

    const loginPayload = {
      token: response.data.accessToken,
      id: response.data.user.id,
      email: response.data.user.email,
      fullname: response.data.user.fullName,
      username: response.data.user.email,
      isAdmin: response.data.user.role?.toLowerCase() === 'admin',
      role: response.data.user.role,
      emailConfirmed: response.data.user.isEmailVerified,
      phoneConfirmed: false,
      isVerified: response.data.user.isActive,
      avatar: response.data.user.avatar || '',
      cover: '',
      firebaseUid: '',
      kycStatus: response.data.user.kycStatus || 'pending',
      age: null,
      bio: null,
      country: null,
      followersCount: 0,
      followingCount: 0,
      gender: response.data.user.gender || null,
      isDeleted: false,
      occupation: null,
      postCount: 0,
      referralCode: response.data.user.referralCode || '',
    };
    console.log('loginSuccess Payload:', loginPayload);
    localStorage.setItem("authToken", response.data.accessToken); // Explicitly store in localStorage
    dispatch(loginSuccess(loginPayload));
    addCookies(response.data, keepSignedIn); // Keep cookies if needed
    console.log('Cookies after addCookies:', document.cookie);

    const user = await fetchUser(response.data.accessToken);
    console.log('fetchUser Response:', user);
    if (user && user.data) {
      if (user.data.role?.toLowerCase() !== 'admin') {
        showError("Access Denied: Only admin users can log in.");
        dispatch(authError());
        clearCookies();
        return;
      }
      dispatch(loggedInUser({
        id: user.data.id,
        firstname: user.data.firstName || '',
        lastname: user.data.lastName || '',
        fullname: user.data.fullName,
        email: user.data.email,
        role: user.data.role,
        created_date: user.data.createdAt || '',
        username: user.data.email,
        gender: user.data.gender || '',
        image_url: user.data.avatar || '',
        kycStatus: user.data.kycStatus || 'pending',
        has_transaction_pin: user.data.isPinCreated || false,
        date_of_birth: user.data.dateOfBirth || null,
        referral_code: user.data.referralCode || '',
        phone: user.data.phone || '',
      }));
    } else {
      showError("Failed to fetch user data. Please try again.");
      dispatch(authError());
      clearCookies();
      return;
    }

    router.push("/dashboard");
  } catch (error: any) {
    console.error("Login error:", error.message);
    showError("An unexpected error occurred. Please try again.");
    dispatch(authError());
  }
};



export const logoutUser =
  (router: any): AppThunk =>
  async (dispatch) => {
    dispatch(logout());
    showSuccess("Successfully Logged Out!");
    dispatch(logoutSuccess());
    clearCookies();
    router.push("/login");
  };