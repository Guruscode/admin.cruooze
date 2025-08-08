import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Document {
  id: string;
  backSide: boolean;
  enable: boolean;
  expireAt: boolean;
  frontSide: boolean;
  isDeleted: boolean;
  title: string;
}

export interface DriverDocumentItem {
  backImage: string;
  documentId: string;
  documentNumber: string;
  expireAt?: Date;
  frontImage: string;
  status: string;
  verified: boolean;
}

export interface DriverDocument {
  id: string;
  documents: DriverDocumentItem[];
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

// Fetch all documents from the document collection
export async function getAllDocuments(): Promise<Document[]> {
  try {
    const documentsCollection = collection(db, "document");
    console.log("Fetching from collection: document");
    const documentsSnapshot = await getDocs(documentsCollection);

    if (documentsSnapshot.empty) {
      console.warn("No documents found in document collection");
      return [];
    }

    console.log("Found documents:", documentsSnapshot.size);
    return documentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Document data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        backSide: data.backSide ?? false,
        enable: data.enable ?? false,
        expireAt: data.expireAt ?? false,
        frontSide: data.frontSide ?? false,
        isDeleted: data.isDeleted ?? false,
        title: data.title || "",
      } as Document;
    });
  } catch (error: any) {
    console.error("Error fetching documents:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch documents: " + error.message);
  }
}

// Fetch all driver documents from the driver_document collection
export async function getAllDriverDocuments(): Promise<DriverDocument[]> {
  try {
    const driverDocumentsCollection = collection(db, "driver_document");
    console.log("Fetching from collection: driver_document");
    const driverDocumentsSnapshot = await getDocs(driverDocumentsCollection);

    if (driverDocumentsSnapshot.empty) {
      console.warn("No documents found in driver_document collection");
      return [];
    }

    console.log("Found driver documents:", driverDocumentsSnapshot.size);
    return driverDocumentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Driver document data:", JSON.stringify(data, null, 2));

      return {
        id: doc.id,
        documents: (data.documents || []).map((item: any) => ({
          backImage: item.backImage || "",
          documentId: item.documentId || "",
          documentNumber: item.documentNumber || "",
          expireAt: parseDateField(item.expireAt),
          frontImage: item.frontImage || "",
          status: item.status || "",
          verified: item.verified ?? false,
        })) as DriverDocumentItem[],
      } as DriverDocument;
    });
  } catch (error: any) {
    console.error("Error fetching driver documents:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch driver documents: " + error.message);
  }
}

// Update a document in the document collection
export async function updateDocument(
  documentId: string,
  updates: Partial<Document>
): Promise<void> {
  try {
    console.log("Updating document:", documentId, JSON.stringify(updates, null, 2));
    const documentDocRef = doc(db, "document", documentId);
    await updateDoc(documentDocRef, updates);
  } catch (error: any) {
    console.error("Error updating document:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update document: " + error.message);
  }
}

// Update a driver document in the driver_document collection
export async function updateDriverDocument(
  driverId: string,
  updates: Partial<DriverDocument>
): Promise<void> {
  try {
    console.log(
      "Updating driver document:",
      driverId,
      JSON.stringify(updates, null, 2)
    );
    const driverDocumentDocRef = doc(db, "driver_document", driverId);
    await updateDoc(driverDocumentDocRef, updates);
  } catch (error: any) {
    console.error("Error updating driver document:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update driver document: " + error.message);
  }
}

// Delete a document from the document collection
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    console.log("Deleting document:", documentId);
    const documentDocRef = doc(db, "document", documentId);
    await deleteDoc(documentDocRef);
  } catch (error: any) {
    console.error("Error deleting document:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete document: " + error.message);
  }
}

// Delete a specific document item from a driver_document's documents array
export async function deleteDriverDocumentItem(
  driverId: string,
  documentIndex: number
): Promise<void> {
  try {
    console.log("Deleting driver document item:", driverId, "index:", documentIndex);
    const driverDocumentDocRef = doc(db, "driver_document", driverId);
    const driverDocument = (
      await getDocs(collection(db, "driver_document"))
    ).docs.find((d) => d.id === driverId);
    if (!driverDocument) {
      throw new Error("Driver document not found");
    }
    const documents = driverDocument.data().documents || [];
    documents.splice(documentIndex, 1);
    await updateDoc(driverDocumentDocRef, { documents });
  } catch (error: any) {
    console.error("Error deleting driver document item:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete driver document item: " + error.message);
  }
}