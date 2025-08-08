import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface Language {
  id: string;
  code: string;
  enable: boolean;
  image: string;
  isDeleted: boolean;
  isRtl: boolean;
  name: string;
}

// Fetch all languages
export async function getAllLanguages(): Promise<Language[]> {
  try {
    const languagesCollection = collection(db, "languages");
    console.log("Fetching from collection: languages");
    const languagesSnapshot = await getDocs(languagesCollection);

    if (languagesSnapshot.empty) {
      console.warn("No documents found in languages collection");
      return [];
    }

    console.log("Found languages:", languagesSnapshot.size);
    return languagesSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Language data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        code: data.code || "",
        enable: data.enable ?? false,
        image: data.image || "",
        isDeleted: data.isDeleted ?? false,
        isRtl: data.isRtl ?? false,
        name: data.name || "",
      } as Language;
    });
  } catch (error: any) {
    console.error("Error fetching languages:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch languages: " + error.message);
  }
}

// Update a language
export async function updateLanguage(
  languageId: string,
  updates: Partial<Language>
): Promise<void> {
  try {
    console.log("Updating language:", languageId, JSON.stringify(updates, null, 2));
    const languageDocRef = doc(db, "languages", languageId);
    await updateDoc(languageDocRef, updates);
  } catch (error: any) {
    console.error("Error updating language:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update language: " + error.message);
  }
}

// Delete a language
export async function deleteLanguage(languageId: string): Promise<void> {
  try {
    console.log("Deleting language:", languageId);
    const languageDocRef = doc(db, "languages", languageId);
    await deleteDoc(languageDocRef);
  } catch (error: any) {
    console.error("Error deleting language:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete language: " + error.message);
  }
}