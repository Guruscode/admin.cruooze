import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface Referral {
  id: string;
  referralBy: string;
  referralCode: string;
}

// Fetch all referrals
export async function getAllReferrals(): Promise<Referral[]> {
  try {
    const referralsCollection = collection(db, "referral");
    console.log("Fetching from collection: referral");
    const referralsSnapshot = await getDocs(referralsCollection);

    if (referralsSnapshot.empty) {
      console.warn("No documents found in referral collection");
      return [];
    }

    console.log("Found referrals:", referralsSnapshot.size);
    return referralsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Referral data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        referralBy: data.referralBy || "",
        referralCode: data.referralCode || "",
      } as Referral;
    });
  } catch (error: any) {
    console.error("Error fetching referrals:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch referrals: " + error.message);
  }
}

// Update a referral
export async function updateReferral(
  referralId: string,
  updates: Partial<Referral>
): Promise<void> {
  try {
    console.log("Updating referral:", referralId, JSON.stringify(updates, null, 2));
    const referralDocRef = doc(db, "referral", referralId);
    await updateDoc(referralDocRef, updates);
  } catch (error: any) {
    console.error("Error updating referral:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update referral: " + error.message);
  }
}

// Delete a referral
export async function deleteReferral(referralId: string): Promise<void> {
  try {
    console.log("Deleting referral:", referralId);
    const referralDocRef = doc(db, "referral", referralId);
    await deleteDoc(referralDocRef);
  } catch (error: any) {
    console.error("Error deleting referral:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete referral: " + error.message);
  }
}