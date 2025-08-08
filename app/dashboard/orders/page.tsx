"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { getAllOrders, updateOrder, deleteOrder, Order } from "@/lib/orderService";

export default function OrderManagementPage() {
  const { user: authUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Error in fetchOrders:", err);
        setError(`Failed to fetch orders: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.destinationLocationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditedOrder({ ...order });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder?.id) return;
    setIsSaving(true);
    try {
      await updateOrder(selectedOrder.id, editedOrder);
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? { ...o, ...editedOrder } : o)));
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update order: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder?.id) return;
    setIsSaving(true);
    try {
      await deleteOrder(selectedOrder.id);
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete order: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedOrder(null);
    setEditedOrder({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Manage and track all orders in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search orders by ID, user ID, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <div className="text-center text-muted-foreground">Loading orders...</div>}
      {error && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-yellow-800 text-sm">{error}</p></div>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>View, edit, or delete order records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id || "N/A"}</TableCell>
                    <TableCell>{order.userId || "N/A"}</TableCell>
                    <TableCell>{order.destinationLocationName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "Ride Placed" ? "default" : "secondary"}>
                        {order.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.paymentType || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(order)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(order)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(order)}>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
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
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
            <DialogTitle>View Order</DialogTitle>
            <DialogDescription>Details of the selected order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <p><strong>Order ID:</strong> {selectedOrder.id || "N/A"}</p>
              <p><strong>User ID:</strong> {selectedOrder.userId || "N/A"}</p>
              <p><strong>Accepted Driver ID:</strong> {selectedOrder.acceptedDriverId || "N/A"}</p>
              <p><strong>Admin Commission Amount:</strong> {selectedOrder.adminCommission?.amount || "N/A"}</p>
              <p><strong>Admin Commission Enabled:</strong> {selectedOrder.adminCommission?.isEnabled ? "Yes" : "No"}</p>
              <p><strong>Admin Commission Type:</strong> {selectedOrder.adminCommission?.type || "N/A"}</p>
              <p><strong>Created Date:</strong> {selectedOrder.createdDate?.toLocaleString() || "N/A"}</p>
              <p><strong>Destination:</strong> {selectedOrder.destinationLocationName || "N/A"}</p>
              <p><strong>Distance:</strong> {selectedOrder.distance || "N/A"} {selectedOrder.distanceType || ""}</p>
              <p><strong>Driver ID:</strong> {selectedOrder.driverId || "N/A"}</p>
              <p><strong>Final Rate:</strong> {selectedOrder.finalRate || "N/A"}</p>
              <p><strong>Offer Rate:</strong> {selectedOrder.offerRate || "N/A"}</p>
              <p><strong>OTP:</strong> {selectedOrder.otp || "N/A"}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus ? "Paid" : "Not Paid"}</p>
              <p><strong>Payment Type:</strong> {selectedOrder.paymentType || "N/A"}</p>
              <p><strong>Rejected Driver ID:</strong> {selectedOrder.rejectedDriverId || "N/A"}</p>
              <p><strong>Service ID:</strong> {selectedOrder.serviceId || "N/A"}</p>
              <p><strong>Service Title:</strong> {selectedOrder.service?.title || "N/A"}</p>
              <p><strong>Service Image:</strong> {selectedOrder.service?.image ? <img src={selectedOrder.service.image} alt="Service" className="w-20 h-20" /> : "N/A"}</p>
              <p><strong>Service Intercity Type:</strong> {selectedOrder.service?.intercityType ? "Yes" : "No"}</p>
              <p><strong>Service KM Charge:</strong> {selectedOrder.service?.kmCharge || "N/A"}</p>
              <p><strong>Source Location:</strong> {selectedOrder.sourceLocationName || "N/A"}</p>
              <p><strong>Source Coordinates:</strong> Lat: {selectedOrder.sourceLocationLatLng?.latitude || "N/A"}, Lng: {selectedOrder.sourceLocationLatLng?.longitude || "N/A"}</p>
              <p><strong>Status:</strong> {selectedOrder.status || "N/A"}</p>
              <p><strong>Tax List:</strong> {selectedOrder.taxList?.length ? selectedOrder.taxList.join(", ") : "None"}</p>
              <p><strong>Update Date:</strong> {selectedOrder.updateDate?.toLocaleString() || "N/A"}</p>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order details</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Accepted Driver ID"
                value={editedOrder.acceptedDriverId ?? ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, acceptedDriverId: e.target.value || null })}
              />
              <Input
                placeholder="Admin Commission Amount"
                value={editedOrder.adminCommission?.amount || ""}
                onChange={(e) =>
                  setEditedOrder({
                    ...editedOrder,
                    adminCommission: { ...editedOrder.adminCommission, amount: e.target.value },
                  })
                }
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Admin Commission Enabled</label>
                <select
                  className="border rounded-md p-2"
                  value={editedOrder.adminCommission?.isEnabled ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      adminCommission: { ...editedOrder.adminCommission, isEnabled: e.target.value === "Yes" },
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Admin Commission Type"
                value={editedOrder.adminCommission?.type || ""}
                onChange={(e) =>
                  setEditedOrder({
                    ...editedOrder,
                    adminCommission: { ...editedOrder.adminCommission, type: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Offer Rate"
                value={editedOrder.offerRate || ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, offerRate: e.target.value })}
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <select
                  className="border rounded-md p-2"
                  value={editedOrder.paymentStatus ? "Yes" : "No"}
                  onChange={(e) => setEditedOrder({ ...editedOrder, paymentStatus: e.target.value === "Yes" })}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Payment Type"
                value={editedOrder.paymentType || ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, paymentType: e.target.value })}
              />
              <Input
                placeholder="Destination Location"
                value={editedOrder.destinationLocationName || ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, destinationLocationName: e.target.value })}
              />
              <Input
                placeholder="Distance"
                value={editedOrder.distance || ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, distance: e.target.value })}
              />
              <Input
                placeholder="Distance Type"
                value={editedOrder.distanceType || ""}
                onChange={(e) => setEditedOrder({ ...editedOrder, distanceType: e.target.value })}
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
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
            <DialogDescription>Are you sure you want to delete this order? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <p><strong>Order ID:</strong> {selectedOrder.id || "N/A"}</p>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
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