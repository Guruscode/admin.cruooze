import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Driver {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  profilePic?: string;
  registrationDate?: string;
  documentVerification?: boolean;
  completedTrips?: number;
  walletAmount?: string;
  isActive?: boolean;
  isOnline?: boolean;
  latitude?: number;
  longitude?: number;
  loginType?: string;
  reviewsCount?: string;
  reviewsSum?: string;
  rotation?: number | null;
  serviceId?: string | null;
  vehicleType?: string;
  fcmToken?: string;
  createdAt?: Date;
}

// Utility function to parse createdAt
function parseCreatedAt(createdAt: any): Date | undefined {
  try {
    if (!createdAt) {
      console.log("createdAt is undefined or null");
      return undefined;
    }
    if (createdAt instanceof Timestamp) {
      console.log("createdAt is a Timestamp");
      return createdAt.toDate();
    }
    if (typeof createdAt === "string") {
      console.log("createdAt is a string:", createdAt);
      const parsedDate = new Date(createdAt);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
    console.log("createdAt is of unexpected type:", typeof createdAt, createdAt);
    return undefined;
  } catch (error: any) {
    console.error("Error parsing createdAt:", error.message);
    return undefined;
  }
}

export async function getAllDrivers(): Promise<Driver[]> {
  try {
    const driversCollection = collection(db, "driver_users");
    console.log("Fetching from collection: driver_users");
    const driversSnapshot = await getDocs(driversCollection);
    
    if (driversSnapshot.empty) {
      console.warn("No documents found in driver_users collection");
      return [];
    }

    console.log("Found documents:", driversSnapshot.size);
    return driversSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Document data:", JSON.stringify(data, null, 2));
      
      return {
        ...data,
        id: doc.id,
        createdAt: parseCreatedAt(data.createdAt),
        latitude: data.latitude ?? 0,
        longitude: data.longitude ?? 0,
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        countryCode: data.countryCode || "",
        profilePic: data.profilePic || "",
        registrationDate: data.registrationDate || "",
        documentVerification: data.documentVerification ?? false,
        completedTrips: data.completedTrips ?? 0,
        walletAmount: data.walletAmount || "0.0",
        isActive: data.isActive ?? false,
        isOnline: data.isOnline ?? false,
        loginType: data.loginType || "",
        reviewsCount: data.reviewsCount || "0.0",
        reviewsSum: data.reviewsSum || "0.0",
        rotation: data.rotation ?? null,
        serviceId: data.serviceId ?? null,
        vehicleType: data.vehicleType || "Unknown",
        fcmToken: data.fcmToken || "",
      } as Driver;
    });
  } catch (error: any) {
    console.error("Error fetching drivers:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch drivers data: " + error.message);
  }
}

export async function updateDriver(driverId: string, updates: Partial<Driver>): Promise<void> {
  try {
    const driverDocRef = doc(db, "driver_users", driverId);
    await updateDoc(driverDocRef, updates);
  } catch (error: any) {
    console.error("Error updating driver:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update driver data: " + error.message);
  }
}

export async function deleteDriver(driverId: string): Promise<void> {
  try {
    const driverDocRef = doc(db, "driver_users", driverId);
    await deleteDoc(driverDocRef);
  } catch (error: any) {
    console.error("Error deleting driver:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete driver data: " + error.message);
  }
}