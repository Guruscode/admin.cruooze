import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";

export const auth = getAuth(app);

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginWithEmail(credentials: LoginCredentials) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.code || "Failed to login");
  }
}