import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface WalletTransaction {
  id: string;
  amount: string;
  createdDate?: Date;
  note?: string;
  orderType?: string;
  paymentType?: string;
  transactionId: string;
  userId: string;
  userType: string;
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

export async function getAllWalletTransactions(): Promise<WalletTransaction[]> {
  try {
    const transactionsCollection = collection(db, "wallet_transaction");
    console.log("Fetching from collection: wallet_transaction");
    console.log("Firestore instance region: nam5");
    const transactionsSnapshot = await getDocs(transactionsCollection);

    if (transactionsSnapshot.empty) {
      console.warn("No documents found in wallet_transaction collection");
      return [];
    }

    console.log("Found documents:", transactionsSnapshot.size);
    return transactionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Document data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        amount: data.amount || "0",
        createdDate: parseDateField(data.createdDate),
        note: data.note || "",
        orderType: data.orderType || "",
        paymentType: data.paymentType || "",
        transactionId: data.transactionId || "",
        userId: data.userId || "",
        userType: data.userType || "",
      } as WalletTransaction;
    });
  } catch (error: any) {
    console.error("Error fetching wallet transactions:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch wallet transactions: " + error.message);
  }
}

export async function updateWalletTransaction(
  transactionId: string,
  updates: Partial<WalletTransaction>
): Promise<void> {
  try {
    console.log(
      "Updating wallet transaction:",
      transactionId,
      JSON.stringify(updates, null, 2)
    );
    const transactionDocRef = doc(db, "wallet_transaction", transactionId);
    await updateDoc(transactionDocRef, updates);
  } catch (error: any) {
    console.error("Error updating wallet transaction:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update wallet transaction: " + error.message);
  }
}

export async function deleteWalletTransaction(transactionId: string): Promise<void> {
  try {
    console.log("Deleting wallet transaction:", transactionId);
    const transactionDocRef = doc(db, "wallet_transaction", transactionId);
    await deleteDoc(transactionDocRef);
  } catch (error: any) {
    console.error("Error deleting wallet transaction:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete wallet transaction: " + error.message);
  }
}