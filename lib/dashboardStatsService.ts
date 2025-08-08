import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { getSettings } from "./settingsService";
import { getAllDrivers, Driver } from "./driverService";
import { getAllUsers, User } from "./userService";
import { getAllWalletTransactions, WalletTransaction } from "./walletTransactionService";
import { getAllOrders, Order } from "./orderService";
import { getAllCustomerReviews, getAllDriverReviews } from "./reviewService";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const getCurrentMonthRange = () => {
  const now = new Date("2025-08-08T17:11:00+01:00"); // 05:11 PM WAT, August 08, 2025
  return { start: startOfMonth(now), end: endOfMonth(now) };
};

export interface DashboardStats {
  totalDrivers: number;
  totalRides: number;
  totalPayments: number;
  totalCustomers: number;
  totalReviews: number;
  referralAmount: string;
  adminCommission: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const settings = await getSettings() || {
    referral: { referralAmount: "100" },
    adminCommission: { amount: "10" },
  };

  const { start, end } = getCurrentMonthRange();
  const fromTimestamp = Timestamp.fromDate(start);
  const toTimestamp = Timestamp.fromDate(end);

  // Fetch drivers
  const drivers = await getAllDrivers();
  const totalDrivers = drivers.filter((d) => d.isActive).length;

  // Fetch users (customers)
  const users = await getAllUsers();
  const totalCustomers = users.length;

  // Fetch wallet transactions (payments)
  const transactions = await getAllWalletTransactions();
  const totalPayments = transactions.filter((t) => t.createdDate && t.createdDate >= start && t.createdDate <= end).length;

  // Fetch orders (rides)
  const orders = await getAllOrders();
  const totalRides = orders.filter((o) => o.createdDate && o.createdDate >= start && o.createdDate <= end && o.status === "Ride Placed").length;

  // Fetch reviews (sum of customer and driver reviews)
  const customerReviews = await getAllCustomerReviews();
  const driverReviews = await getAllDriverReviews();
  const totalReviews = customerReviews.length + driverReviews.length;

  return {
    totalDrivers,
    totalRides,
    totalPayments,
    totalCustomers,
    totalReviews,
    referralAmount: settings.referral.referralAmount,
    adminCommission: settings.adminCommission.amount,
  };
};

// Chart data for rides trend (last 4 months)
export const getRidesTrendData = async (): Promise<{ month: string; rides: number }[]> => {
  const now = new Date("2025-08-08T17:11:00+01:00");
  const months = Array.from({ length: 4 }, (_, i) => {
    const date = subMonths(now, 3 - i);
    return { month: format(date, "MMM yyyy"), start: startOfMonth(date), end: endOfMonth(date) };
  });

  const orders = await getAllOrders();
  const ridesData = await Promise.all(
    months.map(async ({ month, start, end }) => {
      const count = orders.filter((o) => o.createdDate && o.createdDate >= start && o.createdDate <= end && o.status === "Ride Placed").length;
      return { month, rides: count };
    })
  );

  return ridesData;
};