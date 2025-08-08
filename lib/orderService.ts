import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Order {
  id: string;
  acceptedDriverId?: string | null;
  adminCommission?: {
    amount?: string;
    isEnabled?: boolean;
    type?: string;
  };
  createdDate?: Date;
  destinationLocationName?: string;
  distance?: string;
  distanceType?: string;
  driverId?: string | null;
  finalRate?: string | null;
  offerRate?: string;
  otp?: string;
  paymentStatus?: boolean;
  paymentType?: string;
  rejectedDriverId?: string | null;
  service?: {
    enable?: boolean | null;
    id?: string;
    image?: string;
    intercityType?: boolean;
    kmCharge?: string;
    offerRate?: boolean;
    title?: string;
  };
  serviceId?: string;
  sourceLocationLatLng?: {
    latitude?: number;
    longitude?: number;
  };
  sourceLocationName?: string;
  status?: string;
  taxList?: any[];
  updateDate?: Date | null;
  userId?: string;
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

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersCollection = collection(db, "orders");
    console.log("Fetching from collection: orders");
    console.log("Firestore instance region: nam5");
    const ordersSnapshot = await getDocs(ordersCollection);
    
    if (ordersSnapshot.empty) {
      console.warn("No documents found in orders collection");
      return [];
    }

    console.log("Found documents:", ordersSnapshot.size);
    return ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Document data:", JSON.stringify(data, null, 2));
      
      return {
        ...data,
        id: doc.id,
        createdDate: parseDateField(data.createdDate),
        updateDate: parseDateField(data.updateDate),
        acceptedDriverId: data.acceptedDriverId ?? null,
        adminCommission: data.adminCommission
          ? {
              amount: data.adminCommission.amount || "0",
              isEnabled: data.adminCommission.isEnabled ?? false,
              type: data.adminCommission.type || "",
            }
          : undefined,
        destinationLocationName: data.destinationLocationName || "",
        distance: data.distance || "",
        distanceType: data.distanceType || "",
        driverId: data.driverId ?? null,
        finalRate: data.finalRate ?? null,
        offerRate: data.offerRate || "",
        otp: data.otp || "",
        paymentStatus: data.paymentStatus ?? false,
        paymentType: data.paymentType || "",
        rejectedDriverId: data.rejectedDriverId ?? null,
        service: data.service
          ? {
              enable: data.service.enable ?? null,
              id: data.service.id || "",
              image: data.service.image || "",
              intercityType: data.service.intercityType ?? false,
              kmCharge: data.service.kmCharge || "",
              offerRate: data.service.offerRate ?? false,
              title: data.service.title || "",
            }
          : undefined,
        serviceId: data.serviceId || "",
        sourceLocationLatLng: data.sourceLocationLatLng
          ? {
              latitude: data.sourceLocationLatLng.latitude ?? 0,
              longitude: data.sourceLocationLatLng.longitude ?? 0,
            }
          : undefined,
        sourceLocationName: data.sourceLocationName || "",
        status: data.status || "",
        taxList: data.taxList || [],
        userId: data.userId || "",
      } as Order;
    });
  } catch (error: any) {
    console.error("Error fetching orders:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch orders data: " + error.message);
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  try {
    console.log("Updating order:", orderId, JSON.stringify(updates, null, 2));
    const orderDocRef = doc(db, "orders", orderId);
    await updateDoc(orderDocRef, updates);
  } catch (error: any) {
    console.error("Error updating order:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update order data: " + error.message);
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    console.log("Deleting order:", orderId);
    const orderDocRef = doc(db, "orders", orderId);
    await deleteDoc(orderDocRef);
  } catch (error: any) {
    console.error("Error deleting order:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to delete order data: " + error.message);
  }
}