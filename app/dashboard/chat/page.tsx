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
  getAllCustomerReviews,
  getAllDriverReviews,
  updateCustomerReview,
  updateDriverReview,
  deleteCustomerReview,
  deleteDriverReview,
  CustomerReview,
  DriverReview,
} from "@/lib/reviewService";

export default function ReviewManagementPage() {
  const { user: authUser } = useAuth();
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [driverReviews, setDriverReviews] = useState<DriverReview[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);
  const [selectedCustomerReview, setSelectedCustomerReview] = useState<CustomerReview | null>(null);
  const [selectedDriverReview, setSelectedDriverReview] = useState<DriverReview | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedReview, setEditedReview] = useState<Partial<CustomerReview | DriverReview>>({});
  const [reviewType, setReviewType] = useState<"customer" | "driver" | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedCustomerReviews, fetchedDriverReviews] = await Promise.all([
          getAllCustomerReviews(),
          getAllDriverReviews(),
        ]);
        setCustomerReviews(fetchedCustomerReviews);
        setDriverReviews(fetchedDriverReviews);
      } catch (err: any) {
        console.error("Error in fetchReviews:", err);
        setError(
          `Failed to fetch reviews: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredCustomerReviews = customerReviews.filter(
    (review) =>
      review.id.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      review.customerId.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      review.driverId.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      review.type.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const filteredDriverReviews = driverReviews.filter(
    (review) =>
      review.id.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
      review.customerId.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
      review.driverId.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
      review.type.toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  const customerTotalPages = Math.ceil(filteredCustomerReviews.length / itemsPerPage);
  const driverTotalPages = Math.ceil(filteredDriverReviews.length / itemsPerPage);
  const customerStartIndex = (customerPage - 1) * itemsPerPage;
  const driverStartIndex = (driverPage - 1) * itemsPerPage;
  const paginatedCustomerReviews = filteredCustomerReviews.slice(
    customerStartIndex,
    customerStartIndex + itemsPerPage
  );
  const paginatedDriverReviews = filteredDriverReviews.slice(
    driverStartIndex,
    driverStartIndex + itemsPerPage
  );

  const handleView = (
    review: CustomerReview | DriverReview,
    type: "customer" | "driver"
  ) => {
    setReviewType(type);
    if (type === "customer") {
      setSelectedCustomerReview(review as CustomerReview);
      setSelectedDriverReview(null);
    } else {
      setSelectedDriverReview(review as DriverReview);
      setSelectedCustomerReview(null);
    }
    setViewModalOpen(true);
  };

  const handleEdit = (
    review: CustomerReview | DriverReview,
    type: "customer" | "driver"
  ) => {
    setReviewType(type);
    if (type === "customer") {
      setSelectedCustomerReview(review as CustomerReview);
      setSelectedDriverReview(null);
    } else {
      setSelectedDriverReview(review as DriverReview);
      setSelectedCustomerReview(null);
    }
    setEditedReview({ ...review });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!reviewType || (!selectedCustomerReview && !selectedDriverReview)) return;
    setIsSaving(true);
    try {
      if (reviewType === "customer" && selectedCustomerReview?.id) {
        await updateCustomerReview(selectedCustomerReview.id, editedReview);
        setCustomerReviews(
          customerReviews.map((r) =>
            r.id === selectedCustomerReview.id ? { ...r, ...editedReview } : r
          )
        );
      } else if (reviewType === "driver" && selectedDriverReview?.id) {
        await updateDriverReview(selectedDriverReview.id, editedReview);
        setDriverReviews(
          driverReviews.map((r) =>
            r.id === selectedDriverReview.id ? { ...r, ...editedReview } : r
          )
        );
      }
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update review: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (
    review: CustomerReview | DriverReview,
    type: "customer" | "driver"
  ) => {
    setReviewType(type);
    if (type === "customer") {
      setSelectedCustomerReview(review as CustomerReview);
      setSelectedDriverReview(null);
    } else {
      setSelectedDriverReview(review as DriverReview);
      setSelectedCustomerReview(null);
    }
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewType || (!selectedCustomerReview && !selectedDriverReview)) return;
    setIsSaving(true);
    try {
      if (reviewType === "customer" && selectedCustomerReview?.id) {
        await deleteCustomerReview(selectedCustomerReview.id);
        setCustomerReviews(
          customerReviews.filter((r) => r.id !== selectedCustomerReview.id)
        );
      } else if (reviewType === "driver" && selectedDriverReview?.id) {
        await deleteDriverReview(selectedDriverReview.id);
        setDriverReviews(
          driverReviews.filter((r) => r.id !== selectedDriverReview.id)
        );
      }
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete review: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCustomerReview(null);
    setSelectedDriverReview(null);
    setReviewType(null);
    setEditedReview({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
        <p className="text-muted-foreground">
          Manage and track customer and driver reviews
        </p>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading reviews...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-12">
          {/* Customer Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Reviews given by customers about drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search customer reviews by ID, customer ID, driver ID, or type..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Driver ID</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomerReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>{review.customerId}</TableCell>
                      <TableCell>{review.driverId}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(review.rating) > 0 ? "default" : "secondary"}>
                          {review.rating}
                        </Badge>
                      </TableCell>
                      <TableCell>{review.type}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(review, "customer")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(review, "customer")}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(review, "customer")}
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
                  Showing {customerStartIndex + 1} to{" "}
                  {Math.min(customerStartIndex + itemsPerPage, filteredCustomerReviews.length)}{" "}
                  of {filteredCustomerReviews.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomerPage((prev) => Math.max(prev - 1, 1))}
                    disabled={customerPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm">
                    Page {customerPage} of {customerTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCustomerPage((prev) => Math.min(prev + 1, customerTotalPages))
                    }
                    disabled={customerPage === customerTotalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Reviews</CardTitle>
              <CardDescription>Reviews given by drivers about customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search driver reviews by ID, customer ID, driver ID, or type..."
                  value={driverSearchTerm}
                  onChange={(e) => setDriverSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Driver ID</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDriverReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>{review.customerId}</TableCell>
                      <TableCell>{review.driverId}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(review.rating) > 0 ? "default" : "secondary"}>
                          {review.rating}
                        </Badge>
                      </TableCell>
                      <TableCell>{review.type}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(review, "driver")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(review, "driver")}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(review, "driver")}
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
                  Showing {driverStartIndex + 1} to{" "}
                  {Math.min(driverStartIndex + itemsPerPage, filteredDriverReviews.length)} of{" "}
                  {filteredDriverReviews.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDriverPage((prev) => Math.max(prev - 1, 1))}
                    disabled={driverPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm">
                    Page {driverPage} of {driverTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDriverPage((prev) => Math.min(prev + 1, driverTotalPages))
                    }
                    disabled={driverPage === driverTotalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              View {reviewType === "customer" ? "Customer" : "Driver"} Review
            </DialogTitle>
            <DialogDescription>
              Details of the selected {reviewType === "customer" ? "customer" : "driver"} review
            </DialogDescription>
          </DialogHeader>
          {(selectedCustomerReview || selectedDriverReview) && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Review ID:</strong>{" "}
                {selectedCustomerReview?.id || selectedDriverReview?.id}
              </p>
              <p>
                <strong>Customer ID:</strong>{" "}
                {selectedCustomerReview?.customerId || selectedDriverReview?.customerId}
              </p>
              <p>
                <strong>Driver ID:</strong>{" "}
                {selectedCustomerReview?.driverId || selectedDriverReview?.driverId}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                {selectedCustomerReview?.rating || selectedDriverReview?.rating}
              </p>
              <p>
                <strong>Comment:</strong>{" "}
                {(selectedCustomerReview?.comment || selectedDriverReview?.comment) || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {(selectedCustomerReview?.date || selectedDriverReview?.date)?.toLocaleString() ||
                  "N/A"}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {selectedCustomerReview?.type || selectedDriverReview?.type}
              </p>
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
            <DialogTitle>
              Edit {reviewType === "customer" ? "Customer" : "Driver"} Review
            </DialogTitle>
            <DialogDescription>
              Update {reviewType === "customer" ? "customer" : "driver"} review details
            </DialogDescription>
          </DialogHeader>
          {(selectedCustomerReview || selectedDriverReview) && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Comment"
                value={editedReview.comment || ""}
                onChange={(e) =>
                  setEditedReview({ ...editedReview, comment: e.target.value })
                }
              />
              <Input
                placeholder="Rating (0.0 to 5.0)"
                value={editedReview.rating || ""}
                onChange={(e) =>
                  setEditedReview({ ...editedReview, rating: e.target.value })
                }
                type="number"
                step="0.1"
                min="0"
                max="5"
              />
              <Input
                placeholder="Type"
                value={editedReview.type || ""}
                onChange={(e) => setEditedReview({ ...editedReview, type: e.target.value })}
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
            <DialogTitle>
              Confirm Delete {reviewType === "customer" ? "Customer" : "Driver"} Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{" "}
              {reviewType === "customer" ? "customer" : "driver"} review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {(selectedCustomerReview || selectedDriverReview) && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Review ID:</strong>{" "}
                {selectedCustomerReview?.id || selectedDriverReview?.id}
              </p>
              <p>
                <strong>Customer ID:</strong>{" "}
                {selectedCustomerReview?.customerId || selectedDriverReview?.customerId}
              </p>
              <p>
                <strong>Driver ID:</strong>{" "}
                {selectedCustomerReview?.driverId || selectedDriverReview?.driverId}
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