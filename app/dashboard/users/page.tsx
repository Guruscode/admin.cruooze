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
import { getAllUsers, updateUser, deleteUser, User } from "@/lib/userService";

export default function UserManagementPage() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please check Firebase configuration or permissions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser?.id) return;
    setIsSaving(true);
    try {
      await updateUser(selectedUser.id, editedUser);
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...editedUser } : u)));
      setEditModalOpen(false);
    } catch (err) {
      setError("Failed to update user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser?.id) return;
    setIsSaving(true);
    try {
      await deleteUser(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setDeleteModalOpen(false);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUser(null);
    setEditedUser({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage and track all users in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <div className="text-center text-muted-foreground">Loading users...</div>}
      {error && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-yellow-800 text-sm">{error}</p></div>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>View, edit, or delete user records</CardDescription>
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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                    <TableCell>{user.isActive ? <Badge variant="default" className="bg-green-600">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(user)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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
            <DialogTitle>View User</DialogTitle>
            <DialogDescription>Details of the selected user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <p><strong>Name:</strong> {selectedUser.fullName || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedUser.phoneNumber || "N/A"}</p>
              <p><strong>Status:</strong> {selectedUser.isActive ? "Active" : "Inactive"}</p>
              <p><strong>Wallet Amount:</strong> ₦{parseFloat(selectedUser.walletAmount || "0").toLocaleString()}</p>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Full Name"
                value={editedUser.fullName || ""}
                onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={editedUser.email || ""}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
              <Input
                placeholder="Phone Number"
                value={editedUser.phoneNumber || ""}
                onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedUser.isActive || false}
                  onChange={(e) => setEditedUser({ ...editedUser, isActive: e.target.checked })}
                />
                <span>Active</span>
              </div>
              <Input
                placeholder="Wallet Amount"
                value={editedUser.walletAmount || ""}
                onChange={(e) => setEditedUser({ ...editedUser, walletAmount: e.target.value })}
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
            <DialogDescription>Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <p><strong>Name:</strong> {selectedUser.fullName || "N/A"}</p>
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