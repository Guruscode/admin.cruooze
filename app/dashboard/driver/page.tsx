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
import { getAllDrivers, updateDriver, deleteDriver, Driver } from "@/lib/driverService";

export default function DriverManagementPage() {
  const { user: authUser } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedDriver, setEditedDriver] = useState<Partial<Driver>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchDrivers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedDrivers = await getAllDrivers();
        setDrivers(fetchedDrivers);
      } catch (err: any) {
        console.error("Error in fetchDrivers:", err);
        setError(`Failed to fetch drivers: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) =>
    driver.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phoneNumber?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setViewModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditedDriver({ ...driver });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDriver?.id) return;
    setIsSaving(true);
    try {
      await updateDriver(selectedDriver.id, editedDriver);
      setDrivers(drivers.map((d) => (d.id === selectedDriver.id ? { ...d, ...editedDriver } : d)));
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update driver: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDriver?.id) return;
    setIsSaving(true);
    try {
      await deleteDriver(selectedDriver.id);
      setDrivers(drivers.filter((d) => d.id !== selectedDriver.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete driver: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedDriver(null);
    setEditedDriver({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
        <p className="text-muted-foreground">Manage and track all drivers in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search drivers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <div className="text-center text-muted-foreground">Loading drivers...</div>}
      {error && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-yellow-800 text-sm">{error}</p></div>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Driver List</CardTitle>
            <CardDescription>View, edit, or delete driver records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.fullName || "N/A"}</TableCell>
                    <TableCell>{driver.email || "N/A"}</TableCell>
                    <TableCell>{driver.phoneNumber || "N/A"}</TableCell>
                    <TableCell>{driver.isOnline ? <Badge variant="default" className="bg-green-600">Online</Badge> : <Badge variant="destructive">Offline</Badge>}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(driver)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(driver)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(driver)}>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDrivers.length)} of {filteredDrivers.length} entries
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
            <DialogTitle>View Driver</DialogTitle>
            <DialogDescription>Details of the selected driver</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4 py-4">
              <img src={selectedDriver.profilePic || ""} alt="Profile" className="w-20 h-20 rounded-full" />
              <p><strong>Name:</strong> {selectedDriver.fullName || "N/A"}</p>
              <p><strong>Email:</strong> {selectedDriver.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedDriver.countryCode || ""} {selectedDriver.phoneNumber || "N/A"}</p>
              <p><strong>Login Type:</strong> {selectedDriver.loginType || "N/A"}</p>
              <p><strong>Document Verification:</strong> {selectedDriver.documentVerification ? "Yes" : "No"}</p>
              <p><strong>Completed Trips:</strong> {selectedDriver.completedTrips ?? 0}</p>
              <p><strong>Status:</strong> {selectedDriver.isOnline ? "Online" : "Offline"}</p>
              <p><strong>Active:</strong> {selectedDriver.isActive ? "Yes" : "No"}</p>
              <p><strong>Vehicle Type:</strong> {selectedDriver.vehicleType || "N/A"}</p>
              <p><strong>Wallet Amount:</strong> ₦{parseFloat(selectedDriver.walletAmount || "0").toLocaleString()}</p>
              <p><strong>Reviews:</strong> {selectedDriver.reviewsCount} ratings (sum: {selectedDriver.reviewsSum})</p>
              <p><strong>Registration Date:</strong> {selectedDriver.registrationDate || "N/A"}</p>
              <p><strong>Created At:</strong> {selectedDriver.createdAt?.toLocaleString() || "N/A"}</p>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver details</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Full Name"
                value={editedDriver.fullName || ""}
                onChange={(e) => setEditedDriver({ ...editedDriver, fullName: e.target.value })}
              />
              <Input
                placeholder="Phone Number"
                value={editedDriver.phoneNumber || ""}
                onChange={(e) => setEditedDriver({ ...editedDriver, phoneNumber: e.target.value })}
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Document Verified</label>
                <select
                  className="border rounded-md p-2"
                  value={editedDriver.documentVerification ? "Yes" : "No"}
                  onChange={(e) => setEditedDriver({ ...editedDriver, documentVerification: e.target.value === "Yes" })}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Wallet Amount"
                value={editedDriver.walletAmount || ""}
                onChange={(e) => setEditedDriver({ ...editedDriver, walletAmount: e.target.value })}
              />
              <Input
                placeholder="Vehicle Type"
                value={editedDriver.vehicleType || ""}
                onChange={(e) => setEditedDriver({ ...editedDriver, vehicleType: e.target.value })}
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
            <DialogDescription>Are you sure you want to delete this driver? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4 py-4">
              <p><strong>Name:</strong> {selectedDriver.fullName || "N/A"}</p>
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