import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface CustomerReview {
  id: string;
  comment: string;
  customerId: string;
  date?: Date;
  driverId: string;
  rating: string;
  type: string;
}

export interface DriverReview {
  id: string;
  comment: string;
  customerId: string;
  date?: Date;
  driverId: string;
  rating: string;
  type: string;
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

// Fetch all customer reviews
export async function getAllCustomerReviews(): Promise<CustomerReview[]> {
  try {
    const reviewsCollection = collection(db, "review_customer");
    console.log("Fetching from collection: review_customer");
    const reviewsSnapshot = await getDocs(reviewsCollection);

    if (reviewsSnapshot.empty) {
      console.warn("No documents found in review_customer collection");
      return [];
    }

    console.log("Found customer reviews:", reviewsSnapshot.size);
    return reviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Customer review data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        comment: data.comment || "",
        customerId: data.customerId || "",
        date: parseDateField(data.date),
        driverId: data.driverId || "",
        rating: data.rating || "0.0",
        type: data.type || "",
      } as CustomerReview;
    });
  } catch (error: any) {
    console.error("Error fetching customer reviews:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch customer reviews: " + error.message);
  }
}

// Fetch all driver reviews
export async function getAllDriverReviews(): Promise<DriverReview[]> {
  try {
    const reviewsCollection = collection(db, "review_driver");
    console.log("Fetching from collection: review_driver");
    const reviewsSnapshot = await getDocs(reviewsCollection);

    if (reviewsSnapshot.empty) {
      console.warn("No documents found in review_driver collection");
      return [];
    }

    console.log("Found driver reviews:", reviewsSnapshot.size);
    return reviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Driver review data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        comment: data.comment || "",
        customerId: data.customerId || "",
        date: parseDateField(data.date),
        driverId: data.driverId || "",
        rating: data.rating || "0.0",
        type: data.type || "",
      } as DriverReview;
    });
  } catch (error: any) {
    console.error("Error fetching driver reviews:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch driver reviews: " + error.message);
  }
}

// Update a customer review
export async function updateCustomerReview(
  reviewId: string,
  updates: Partial<CustomerReview>
): Promise<void> {
  try {
    console.log(
      "Updating customer review:",
      reviewId,
      JSON.stringify(updates, null, 2)
    );
    const reviewDocRef = doc(db, "review_customer", reviewId);
    await updateDoc(reviewDocRef, updates);
  } catch (error: any) {
    console.error("Error updating customer review:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update customer review: " + error.message);
  }
}

// Update a driver review
export async function updateDriverReview(
  reviewId: string,
  updates: Partial<DriverReview>
): Promise<void> {
  try {
    console.log(
      "Updating driver review:",
      reviewId,
      JSON.stringify(updates, null, 2)
    );
    const reviewDocRef = doc(db, "review_driver", reviewId);
    await updateDoc(reviewDocRef, updates);
  } catch (error: any) {
    console.error("Error updating driver review:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update driver review: " + error.message);
  }
}

// Delete a customer review
export async function deleteCustomerReview(reviewId: string): Promise<void> {
  try {
    console.log("Deleting customer review:", reviewId);
    const reviewDocRef = doc(db, "review_customer", reviewId);
    await deleteDoc(reviewDocRef);
  } catch (error: any) {
    console.error("Error deleting customer review:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete customer review: " + error.message);
  }
}

// Delete a driver review
export async function deleteDriverReview(reviewId: string): Promise<void> {
  try {
    console.log("Deleting driver review:", reviewId);
    const reviewDocRef = doc(db, "review_driver", reviewId);
    await deleteDoc(reviewDocRef);
  } catch (error: any) {
    console.error("Error deleting driver review:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete driver review: " + error.message);
  }
}