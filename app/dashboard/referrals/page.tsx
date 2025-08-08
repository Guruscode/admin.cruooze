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
import { getAllReferrals, updateReferral, deleteReferral, Referral } from "@/lib/referralService";

export default function ReferralManagementPage() {
  const { user: authUser } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedReferral, setEditedReferral] = useState<Partial<Referral>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchReferrals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedReferrals = await getAllReferrals();
        setReferrals(fetchedReferrals);
      } catch (err: any) {
        console.error("Error in fetchReferrals:", err);
        setError(
          `Failed to fetch referrals: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const filteredReferrals = referrals.filter(
    (referral) =>
      referral.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referralBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReferrals = filteredReferrals.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (referral: Referral) => {
    setSelectedReferral(referral);
    setViewModalOpen(true);
  };

  const handleEdit = (referral: Referral) => {
    setSelectedReferral(referral);
    setEditedReferral({ ...referral });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedReferral?.id) return;
    setIsSaving(true);
    try {
      await updateReferral(selectedReferral.id, editedReferral);
      setReferrals(
        referrals.map((r) => (r.id === selectedReferral.id ? { ...r, ...editedReferral } : r))
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update referral: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (referral: Referral) => {
    setSelectedReferral(referral);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReferral?.id) return;
    setIsSaving(true);
    try {
      await deleteReferral(selectedReferral.id);
      setReferrals(referrals.filter((r) => r.id !== selectedReferral.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete referral: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedReferral(null);
    setEditedReferral({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Management</h1>
        <p className="text-muted-foreground">Manage and track all referrals in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search referrals by ID, code, or referrer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading referrals...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Referral List</CardTitle>
            <CardDescription>View, edit, or delete referral records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referral ID</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Referred By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.id}</TableCell>
                    <TableCell>{referral.referralCode}</TableCell>
                    <TableCell>{referral.referralBy || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(referral)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(referral)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(referral)}
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
                {Math.min(startIndex + itemsPerPage, filteredReferrals.length)} of{" "}
                {filteredReferrals.length} entries
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
            <DialogTitle>View Referral</DialogTitle>
            <DialogDescription>Details of the selected referral</DialogDescription>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4 py-4">
              <p><strong>Referral ID:</strong> {selectedReferral.id}</p>
              <p><strong>Referral Code:</strong> {selectedReferral.referralCode}</p>
              <p><strong>Referred By:</strong> {selectedReferral.referralBy || "N/A"}</p>
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
            <DialogTitle>Edit Referral</DialogTitle>
            <DialogDescription>Update referral details</DialogDescription>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Referral Code"
                value={editedReferral.referralCode || ""}
                onChange={(e) =>
                  setEditedReferral({ ...editedReferral, referralCode: e.target.value })
                }
              />
              <Input
                placeholder="Referred By"
                value={editedReferral.referralBy || ""}
                onChange={(e) =>
                  setEditedReferral({ ...editedReferral, referralBy: e.target.value })
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
            <DialogTitle>Confirm Delete Referral</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this referral? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4 py-4">
              <p><strong>Referral ID:</strong> {selectedReferral.id}</p>
              <p><strong>Referral Code:</strong> {selectedReferral.referralCode}</p>
              <p><strong>Referred By:</strong> {selectedReferral.referralBy || "N/A"}</p>
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