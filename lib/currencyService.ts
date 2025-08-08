import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Currency {
  id: string;
  code: string;
  createdAt?: Date;
  decimalDigits: number;
  enable: boolean;
  name: string;
  symbol: string;
  symbolAtRight: boolean;
  updatedAt?: Date;
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

// Fetch all currencies
export async function getAllCurrencies(): Promise<Currency[]> {
  try {
    const currenciesCollection = collection(db, "currency");
    console.log("Fetching from collection: currency");
    const currenciesSnapshot = await getDocs(currenciesCollection);

    if (currenciesSnapshot.empty) {
      console.warn("No documents found in currency collection");
      return [];
    }

    console.log("Found currencies:", currenciesSnapshot.size);
    return currenciesSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Currency data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        code: data.code || "",
        createdAt: parseDateField(data.createdAt),
        decimalDigits: data.decimalDigits ?? 0,
        enable: data.enable ?? false,
        name: data.name || "",
        symbol: data.symbol || "",
        symbolAtRight: data.symbolAtRight ?? false,
        updatedAt: parseDateField(data.updatedAt),
      } as Currency;
    });
  } catch (error: any) {
    console.error("Error fetching currencies:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch currencies: " + error.message);
  }
}

// Update a currency
export async function updateCurrency(
  currencyId: string,
  updates: Partial<Currency>
): Promise<void> {
  try {
    console.log("Updating currency:", currencyId, JSON.stringify(updates, null, 2));
    const currencyDocRef = doc(db, "currency", currencyId);
    await updateDoc(currencyDocRef, updates);
  } catch (error: any) {
    console.error("Error updating currency:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update currency: " + error.message);
  }
}

// Delete a currency
export async function deleteCurrency(currencyId: string): Promise<void> {
  try {
    console.log("Deleting currency:", currencyId);
    const currencyDocRef = doc(db, "currency", currencyId);
    await deleteDoc(currencyDocRef);
  } catch (error: any) {
    console.error("Error deleting currency:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete currency: " + error.message);
  }
}