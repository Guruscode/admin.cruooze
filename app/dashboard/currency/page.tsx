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
import { getAllCurrencies, updateCurrency, deleteCurrency, Currency } from "@/lib/currencyService";

export default function CurrencyManagementPage() {
  const { user: authUser } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCurrency, setEditedCurrency] = useState<Partial<Currency>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCurrencies = await getAllCurrencies();
        setCurrencies(fetchedCurrencies);
      } catch (err: any) {
        console.error("Error in fetchCurrencies:", err);
        setError(
          `Failed to fetch currencies: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (currency: Currency) => {
    setSelectedCurrency(currency);
    setViewModalOpen(true);
  };

  const handleEdit = (currency: Currency) => {
    setSelectedCurrency(currency);
    setEditedCurrency({ ...currency });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCurrency?.id) return;
    setIsSaving(true);
    try {
      await updateCurrency(selectedCurrency.id, editedCurrency);
      setCurrencies(
        currencies.map((c) => (c.id === selectedCurrency.id ? { ...c, ...editedCurrency } : c))
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update currency: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (currency: Currency) => {
    setSelectedCurrency(currency);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCurrency?.id) return;
    setIsSaving(true);
    try {
      await deleteCurrency(selectedCurrency.id);
      setCurrencies(currencies.filter((c) => c.id !== selectedCurrency.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete currency: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCurrency(null);
    setEditedCurrency({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Currency Management</h1>
        <p className="text-muted-foreground">Manage and track all currencies in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search currencies by ID, code, name, or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading currencies...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Currency List</CardTitle>
            <CardDescription>View, edit, or delete currency records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Decimal Digits</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCurrencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell>{currency.id}</TableCell>
                    <TableCell>{currency.code}</TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell>{currency.symbol}</TableCell>
                    <TableCell>{currency.decimalDigits}</TableCell>
                    <TableCell>
                      <Badge variant={currency.enable ? "default" : "secondary"}>
                        {currency.enable ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(currency)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(currency)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(currency)}
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
                {Math.min(startIndex + itemsPerPage, filteredCurrencies.length)} of{" "}
                {filteredCurrencies.length} entries
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
            <DialogTitle>View Currency</DialogTitle>
            <DialogDescription>Details of the selected currency</DialogDescription>
          </DialogHeader>
          {selectedCurrency && (
            <div className="space-y-4 py-4">
              <p><strong>Currency ID:</strong> {selectedCurrency.id}</p>
              <p><strong>Code:</strong> {selectedCurrency.code}</p>
              <p><strong>Name:</strong> {selectedCurrency.name}</p>
              <p><strong>Symbol:</strong> {selectedCurrency.symbol}</p>
              <p><strong>Decimal Digits:</strong> {selectedCurrency.decimalDigits}</p>
              <p><strong>Enable:</strong> {selectedCurrency.enable ? "Yes" : "No"}</p>
              <p><strong>Symbol at Right:</strong> {selectedCurrency.symbolAtRight ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {selectedCurrency.createdAt?.toLocaleString() || "N/A"}</p>
              <p><strong>Updated At:</strong> {selectedCurrency.updatedAt?.toLocaleString() || "N/A"}</p>
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
            <DialogTitle>Edit Currency</DialogTitle>
            <DialogDescription>Update currency details</DialogDescription>
          </DialogHeader>
          {selectedCurrency && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Code"
                value={editedCurrency.code || ""}
                onChange={(e) =>
                  setEditedCurrency({ ...editedCurrency, code: e.target.value })
                }
              />
              <Input
                placeholder="Name"
                value={editedCurrency.name || ""}
                onChange={(e) =>
                  setEditedCurrency({ ...editedCurrency, name: e.target.value })
                }
              />
              <Input
                placeholder="Symbol"
                value={editedCurrency.symbol || ""}
                onChange={(e) =>
                  setEditedCurrency({ ...editedCurrency, symbol: e.target.value })
                }
              />
              <Input
                placeholder="Decimal Digits"
                value={editedCurrency.decimalDigits ?? ""}
                onChange={(e) =>
                  setEditedCurrency({
                    ...editedCurrency,
                    decimalDigits: parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                min="0"
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Enable</label>
                <select
                  className="border rounded-md p-2"
                  value={editedCurrency.enable ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedCurrency({
                      ...editedCurrency,
                      enable: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Symbol at Right</label>
                <select
                  className="border rounded-md p-2"
                  value={editedCurrency.symbolAtRight ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedCurrency({
                      ...editedCurrency,
                      symbolAtRight: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Created At (YYYY-MM-DD)"
                value={
                  editedCurrency.createdAt
                    ? editedCurrency.createdAt.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedCurrency({
                    ...editedCurrency,
                    createdAt: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                type="date"
              />
              <Input
                placeholder="Updated At (YYYY-MM-DD)"
                value={
                  editedCurrency.updatedAt
                    ? editedCurrency.updatedAt.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedCurrency({
                    ...editedCurrency,
                    updatedAt: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                type="date"
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
            <DialogTitle>Confirm Delete Currency</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this currency? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCurrency && (
            <div className="space-y-4 py-4">
              <p><strong>Currency ID:</strong> {selectedCurrency.id}</p>
              <p><strong>Code:</strong> {selectedCurrency.code}</p>
              <p><strong>Name:</strong> {selectedCurrency.name}</p>
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