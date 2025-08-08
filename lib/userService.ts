// lib/userService.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export interface User {
  fullName?: string;
  id?: string;
  email?: string;
  loginType?: string;
  profilePic?: string;
  fcmToken?: string;
  countryCode?: string;
  phoneNumber?: string;
  reviewsCount?: string;
  reviewsSum?: string;
  walletAmount?: string;
  isActive?: boolean;
  createdAt?: Date; // Converted from Timestamp
  latitude?: number;
  longitude?: number;
  referralId?: string;
  referrerId?: string;
  emailVerified?: boolean;
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : undefined,
      latitude: doc.data().latitude || 0,
      longitude: doc.data().longitude || 0,
    } as User));
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users data");
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, updates);
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user data");
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user data");
  }
}