import { auth, loginWithEmail } from "@/lib/auth";
import type { LoginCredentials } from "@/types/auth.type";

export async function userLoginService(email: string, password: string) {
  try {
    const userCredential = await loginWithEmail({ email, password });
    return { user: userCredential.user, success: true };
  } catch (error: any) {
    return { success: false, message: mapFirebaseError(error.code) };
  }
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    default:
      return "An error occurred. Please try again";
  }
}