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
import { getAllCoupons, updateCoupon, deleteCoupon, Coupon } from "@/lib/couponService";

export default function CouponManagementPage() {
  const { user: authUser } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCoupon, setEditedCoupon] = useState<Partial<Coupon>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchCoupons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCoupons = await getAllCoupons();
        setCoupons(fetchedCoupons);
      } catch (err: any) {
        console.error("Error in fetchCoupons:", err);
        setError(
          `Failed to fetch coupons: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setViewModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditedCoupon({ ...coupon });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCoupon?.id) return;
    setIsSaving(true);
    try {
      await updateCoupon(selectedCoupon.id, editedCoupon);
      setCoupons(
        coupons.map((c) => (c.id === selectedCoupon.id ? { ...c, ...editedCoupon } : c))
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update coupon: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCoupon?.id) return;
    setIsSaving(true);
    try {
      await deleteCoupon(selectedCoupon.id);
      setCoupons(coupons.filter((c) => c.id !== selectedCoupon.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete coupon: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCoupon(null);
    setEditedCoupon({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
        <p className="text-muted-foreground">Manage and track all coupons in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search coupons by ID, code, title, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading coupons...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Coupon List</CardTitle>
            <CardDescription>View, edit, or delete coupon records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.id}</TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.title}</TableCell>
                    <TableCell>{coupon.amount}</TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.enable ? "default" : "secondary"}>
                        {coupon.enable ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(coupon)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(coupon)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(coupon)}
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
                {Math.min(startIndex + itemsPerPage, filteredCoupons.length)} of{" "}
                {filteredCoupons.length} entries
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
            <DialogTitle>View Coupon</DialogTitle>
            <DialogDescription>Details of the selected coupon</DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4 py-4">
              <p><strong>Coupon ID:</strong> {selectedCoupon.id}</p>
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><strong>Title:</strong> {selectedCoupon.title}</p>
              <p><strong>Amount:</strong> {selectedCoupon.amount}</p>
              <p><strong>Type:</strong> {selectedCoupon.type}</p>
              <p><strong>Enable:</strong> {selectedCoupon.enable ? "Yes" : "No"}</p>
              <p><strong>Is Public:</strong> {selectedCoupon.isPublic ? "Yes" : "No"}</p>
              <p><strong>Is Deleted:</strong> {selectedCoupon.isDeleted ? "Yes" : "No"}</p>
              <p><strong>Validity:</strong> {selectedCoupon.validity?.toLocaleString() || "N/A"}</p>
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
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon details</DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Code"
                value={editedCoupon.code || ""}
                onChange={(e) =>
                  setEditedCoupon({ ...editedCoupon, code: e.target.value })
                }
              />
              <Input
                placeholder="Title"
                value={editedCoupon.title || ""}
                onChange={(e) =>
                  setEditedCoupon({ ...editedCoupon, title: e.target.value })
                }
              />
              <Input
                placeholder="Amount"
                value={editedCoupon.amount || ""}
                onChange={(e) =>
                  setEditedCoupon({ ...editedCoupon, amount: e.target.value })
                }
                type="number"
                step="0.01"
                min="0"
              />
              <Input
                placeholder="Type"
                value={editedCoupon.type || ""}
                onChange={(e) =>
                  setEditedCoupon({ ...editedCoupon, type: e.target.value })
                }
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Enable</label>
                <select
                  className="border rounded-md p-2"
                  value={editedCoupon.enable ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedCoupon({
                      ...editedCoupon,
                      enable: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Is Public</label>
                <select
                  className="border rounded-md p-2"
                  value={editedCoupon.isPublic ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedCoupon({
                      ...editedCoupon,
                      isPublic: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Is Deleted</label>
                <select
                  className="border rounded-md p-2"
                  value={editedCoupon.isDeleted ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedCoupon({
                      ...editedCoupon,
                      isDeleted: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Validity (YYYY-MM-DD)"
                value={
                  editedCoupon.validity
                    ? editedCoupon.validity.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedCoupon({
                    ...editedCoupon,
                    validity: e.target.value ? new Date(e.target.value) : undefined,
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
            <DialogTitle>Confirm Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4 py-4">
              <p><strong>Coupon ID:</strong> {selectedCoupon.id}</p>
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><strong>Title:</strong> {selectedCoupon.title}</p>
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