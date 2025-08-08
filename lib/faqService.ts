import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface FAQ {
  id: string;
  description: string;
  enable: boolean;
  title: string;
}

// Fetch all FAQs
export async function getAllFAQs(): Promise<FAQ[]> {
  try {
    const faqsCollection = collection(db, "faq");
    console.log("Fetching from collection: faq");
    const faqsSnapshot = await getDocs(faqsCollection);

    if (faqsSnapshot.empty) {
      console.warn("No documents found in faq collection");
      return [];
    }

    console.log("Found FAQs:", faqsSnapshot.size);
    return faqsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("FAQ data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        description: data.description || "",
        enable: data.enable ?? false,
        title: data.title || "",
      } as FAQ;
    });
  } catch (error: any) {
    console.error("Error fetching FAQs:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch FAQs: " + error.message);
  }
}

// Update an FAQ
export async function updateFAQ(
  faqId: string,
  updates: Partial<FAQ>
): Promise<void> {
  try {
    console.log("Updating FAQ:", faqId, JSON.stringify(updates, null, 2));
    const faqDocRef = doc(db, "faq", faqId);
    await updateDoc(faqDocRef, updates);
  } catch (error: any) {
    console.error("Error updating FAQ:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update FAQ: " + error.message);
  }
}

// Delete an FAQ
export async function deleteFAQ(faqId: string): Promise<void> {
  try {
    console.log("Deleting FAQ:", faqId);
    const faqDocRef = doc(db, "faq", faqId);
    await deleteDoc(faqDocRef);
  } catch (error: any) {
    console.error("Error deleting FAQ:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete FAQ: " + error.message);
  }
}