import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Coupon {
  id: string;
  amount: string;
  code: string;
  enable: boolean;
  isDeleted: boolean;
  isPublic: boolean;
  title: string;
  type: string;
  validity?: Date;
}

// Utility function to parse date fields
function parseDateField(dateField: any): Date | undefined {
  try {
    if (!dateField) {
      console.log("Date field is undefined or null");
      return undefined;
    }
    if (dateField instanceof Timestamp) {
      console.log("Date field is a Timestamp");
      return dateField.toDate();
    }
    if (dateField && typeof dateField === "object" && "_seconds" in dateField && "_nanoseconds" in dateField) {
      console.log("Date field is a Firestore Timestamp map:", dateField);
      return new Date(dateField._seconds * 1000 + dateField._nanoseconds / 1000000);
    }
    if (typeof dateField === "string") {
      console.log("Date field is a string:", dateField);
      const parsedDate = new Date(dateField);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
    console.log("Date field is of unexpected type:", typeof dateField, dateField);
    return undefined;
  } catch (error: any) {
    console.error("Error parsing date field:", error.message);
    return undefined;
  }
}

// Fetch all coupons
export async function getAllCoupons(): Promise<Coupon[]> {
  try {
    const couponsCollection = collection(db, "coupon");
    console.log("Fetching from collection: coupon");
    const couponsSnapshot = await getDocs(couponsCollection);

    if (couponsSnapshot.empty) {
      console.warn("No documents found in coupon collection");
      return [];
    }

    console.log("Found coupons:", couponsSnapshot.size);
    return couponsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Coupon data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        amount: data.amount || "0",
        code: data.code || "",
        enable: data.enable ?? false,
        isDeleted: data.isDeleted ?? false,
        isPublic: data.isPublic ?? false,
        title: data.title || "",
        type: data.type || "",
        validity: parseDateField(data.validity),
      } as Coupon;
    });
  } catch (error: any) {
    console.error("Error fetching coupons:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch coupons: " + error.message);
  }
}

// Update a coupon
export async function updateCoupon(
  couponId: string,
  updates: Partial<Coupon>
): Promise<void> {
  try {
    console.log("Updating coupon:", couponId, JSON.stringify(updates, null, 2));
    const couponDocRef = doc(db, "coupon", couponId);
    await updateDoc(couponDocRef, updates);
  } catch (error: any) {
    console.error("Error updating coupon:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update coupon: " + error.message);
  }
}

// Delete a coupon
export async function deleteCoupon(couponId: string): Promise<void> {
  try {
    console.log("Deleting coupon:", couponId);
    const couponDocRef = doc(db, "coupon", couponId);
    await deleteDoc(couponDocRef);
  } catch (error: any) {
    console.error("Error deleting coupon:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete coupon: " + error.message);
  }
}