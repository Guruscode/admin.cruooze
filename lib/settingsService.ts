import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export interface AdminCommission {
  amount: string;
  isEnabled: boolean;
  type: string;
}

export interface ContactUs {
  address: string;
  email: string;
  phone: string;
  subject: string;
  supportURL: string;
}

export interface Global {
  appVersion: string;
  privacyPolicy: string;
  termsAndConditions: string;
}

export interface GlobalKey {
  googleMapKey: string;
  serverKey: string;
}

export interface GlobalValue {
  distanceType: string;
  minimumAmountToWithdrawal: string;
  minimumDepositToRideAccept: string;
  radius: string;
}

export interface Logo {
  appFavIconLogo: string;
  appLogo: string;
}

export interface PaymentMethod {
  enable: boolean;
  image: string;
  name: string;
  [key: string]: any; // For additional method-specific fields
}

export interface Payment {
  cash: PaymentMethod;
  flutterWave: PaymentMethod & {
    encryptionKey: string;
    isSandbox: boolean;
    publicKey: string;
    secretKey: string;
  };
  mercadoPago: PaymentMethod & {
    accessToken: string;
    isSandbox: boolean;
    publicKey: string;
  };
  payStack: PaymentMethod & {
    callbackURL: string;
    isSandbox: boolean;
    publicKey: string;
    secretKey: string;
    webhookURL: string;
  };
  payfast: PaymentMethod & {
    cancel_url: string;
    isSandbox: boolean;
    merchantId: string;
    merchantKey: string;
    notify_url: string;
    return_url: string;
  };
  paypal: PaymentMethod & {
    braintree_merchantid: string;
    braintree_privatekey: string;
    braintree_publickey: string;
    braintree_tokenizationKey: string;
    isSandbox: boolean;
    paypalAppId: string;
    paypalSecret: string;
    paypalUserName: string;
    paypalpassword: string;
  };
  paytm: PaymentMethod & {
    isSandbox: boolean;
    merchantKey: string;
    paytmMID: string;
  };
  razorpay: PaymentMethod & {
    isSandbox: boolean;
    razorpayKey: string;
    razorpaySecret: string;
  };
  strip: PaymentMethod & {
    clientpublishableKey: string;
    isSandbox: boolean;
    stripeSecret: string;
  };
  wallet: PaymentMethod;
}

export interface Referral {
  referralAmount: string;
}

export interface Settings {
  adminCommission: AdminCommission;
  contact_us: ContactUs;
  global: Global;
  globalKey: GlobalKey;
  globalValue: GlobalValue;
  logo: Logo;
  payment: Payment;
  referral: Referral;
}

// Fetch settings document
export async function getSettings(settingsId: string = "settings"): Promise<Settings | null> {
  try {
    const settingsDocRef = doc(db, "settings", settingsId);
    console.log("Fetching settings document:", settingsId);
    const settingsDoc = await getDoc(settingsDocRef);

    if (!settingsDoc.exists()) {
      console.warn("Settings document not found");
      return null;
    }

    const data = settingsDoc.data();
    console.log("Settings data:", JSON.stringify(data, null, 2));

    return {
      adminCommission: data.adminCommission || {
        amount: "",
        isEnabled: false,
        type: "",
      },
      contact_us: data.contact_us || {
        address: "",
        email: "",
        phone: "",
        subject: "",
        supportURL: "",
      },
      global: data.global || {
        appVersion: "",
        privacyPolicy: "",
        termsAndConditions: "",
      },
      globalKey: data.globalKey || {
        googleMapKey: "",
        serverKey: "",
      },
      globalValue: data.globalValue || {
        distanceType: "",
        minimumAmountToWithdrawal: "",
        minimumDepositToRideAccept: "",
        radius: "",
      },
      logo: data.logo || {
        appFavIconLogo: "",
        appLogo: "",
      },
      payment: data.payment || {
        cash: { enable: false, image: "", name: "" },
        flutterWave: { enable: false, image: "", name: "", encryptionKey: "", isSandbox: false, publicKey: "", secretKey: "" },
        mercadoPago: { enable: false, image: "", name: "", accessToken: "", isSandbox: false, publicKey: "" },
        payStack: { enable: false, image: "", name: "", callbackURL: "", isSandbox: false, publicKey: "", secretKey: "", webhookURL: "" },
        payfast: { enable: false, image: "", name: "", cancel_url: "", isSandbox: false, merchantId: "", merchantKey: "", notify_url: "", return_url: "" },
        paypal: { enable: false, image: "", name: "", braintree_merchantid: "", braintree_privatekey: "", braintree_publickey: "", braintree_tokenizationKey: "", isSandbox: false, paypalAppId: "", paypalSecret: "", paypalUserName: "", paypalpassword: "" },
        paytm: { enable: false, image: "", name: "", isSandbox: false, merchantKey: "", paytmMID: "" },
        razorpay: { enable: false, image: "", name: "", isSandbox: false, razorpayKey: "", razorpaySecret: "" },
        strip: { enable: false, image: "", name: "", clientpublishableKey: "", isSandbox: false, stripeSecret: "" },
        wallet: { enable: false, image: "", name: "" },
      },
      referral: data.referral || {
        referralAmount: "",
      },
    } as Settings;
  } catch (error: any) {
    console.error("Error fetching settings:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch settings: " + error.message);
  }
}

// Update settings document
export async function updateSettings(settingsId: string = "settings", updates: Partial<Settings>): Promise<void> {
  try {
    console.log("Updating settings document:", settingsId, JSON.stringify(updates, null, 2));
    const settingsDocRef = doc(db, "settings", settingsId);
    await updateDoc(settingsDocRef, updates);
  } catch (error: any) {
    console.error("Error updating settings:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to update settings: " + error.message);
  }
}