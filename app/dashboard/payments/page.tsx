"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getAllWalletTransactions,
  updateWalletTransaction,
  deleteWalletTransaction,
  WalletTransaction,
} from "@/lib/walletTransactionService";

export default function WalletTransactionManagementPage() {
  const { user: authUser } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<Partial<WalletTransaction>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTransactions = await getAllWalletTransactions();
        setTransactions(fetchedTransactions);
      } catch (err: any) {
        console.error("Error in fetchTransactions:", err);
        setError(
          `Failed to fetch wallet transactions: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setViewModalOpen(true);
  };

  const handleEdit = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setEditedTransaction({ ...transaction });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTransaction?.id) return;
    setIsSaving(true);
    try {
      await updateWalletTransaction(selectedTransaction.id, editedTransaction);
      setTransactions(
        transactions.map((t) =>
          t.id === selectedTransaction.id ? { ...t, ...editedTransaction } : t
        )
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update wallet transaction: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransaction?.id) return;
    setIsSaving(true);
    try {
      await deleteWalletTransaction(selectedTransaction.id);
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete wallet transaction: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedTransaction(null);
    setEditedTransaction({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Transaction Management</h1>
        <p className="text-muted-foreground">
          Manage and track all wallet transactions in the system
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search transactions by ID, user ID, or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">
          Loading wallet transactions...
        </div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Transaction List</CardTitle>
            <CardDescription>View, edit, or delete wallet transaction records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.transactionId || "N/A"}</TableCell>
                    <TableCell>{transaction.userId || "N/A"}</TableCell>
                    <TableCell>{transaction.amount || "N/A"}</TableCell>
                    <TableCell>{transaction.paymentType || "N/A"}</TableCell>
                    <TableCell>{transaction.userType || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(transaction)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(transaction)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of{" "}
                {filteredTransactions.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Wallet Transaction</DialogTitle>
            <DialogDescription>Details of the selected wallet transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <p><strong>Transaction ID:</strong> {selectedTransaction.transactionId || "N/A"}</p>
              <p><strong>Document ID:</strong> {selectedTransaction.id || "N/A"}</p>
              <p><strong>User ID:</strong> {selectedTransaction.userId || "N/A"}</p>
              <p><strong>Amount:</strong> {selectedTransaction.amount || "N/A"}</p>
              <p><strong>Created Date:</strong> {selectedTransaction.createdDate?.toLocaleString() || "N/A"}</p>
              <p><strong>Note:</strong> {selectedTransaction.note || "N/A"}</p>
              <p><strong>Order Type:</strong> {selectedTransaction.orderType || "N/A"}</p>
              <p><strong>Payment Type:</strong> {selectedTransaction.paymentType || "N/A"}</p>
              <p><strong>User Type:</strong> {selectedTransaction.userType || "N/A"}</p>
              <Button onClick={closeModal} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet Transaction</DialogTitle>
            <DialogDescription>Update wallet transaction details</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Amount"
                value={editedTransaction.amount || ""}
                onChange={(e) =>
                  setEditedTransaction({ ...editedTransaction, amount: e.target.value })
                }
              />
              <Input
                placeholder="Note"
                value={editedTransaction.note || ""}
                onChange={(e) =>
                  setEditedTransaction({ ...editedTransaction, note: e.target.value })
                }
              />
              <Input
                placeholder="Order Type"
                value={editedTransaction.orderType || ""}
                onChange={(e) =>
                  setEditedTransaction({ ...editedTransaction, orderType: e.target.value })
                }
              />
              <Input
                placeholder="Payment Type"
                value={editedTransaction.paymentType || ""}
                onChange={(e) =>
                  setEditedTransaction({
                    ...editedTransaction,
                    paymentType: e.target.value,
                  })
                }
              />
              <Input
                placeholder="User Type"
                value={editedTransaction.userType || ""}
                onChange={(e) =>
                  setEditedTransaction({ ...editedTransaction, userType: e.target.value })
                }
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wallet transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Transaction ID:</strong> {selectedTransaction.transactionId || "N/A"}
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}