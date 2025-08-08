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
import { getAllFAQs, updateFAQ, deleteFAQ, FAQ } from "@/lib/faqService";

export default function FaqManagementPage() {
  const { user: authUser } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedFAQ, setEditedFAQ] = useState<Partial<FAQ>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchFAQs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedFAQs = await getAllFAQs();
        setFaqs(fetchedFAQs);
      } catch (err: any) {
        console.error("Error in fetchFAQs:", err);
        setError(
          `Failed to fetch FAQs: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setViewModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setEditedFAQ({ ...faq });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedFAQ?.id) return;
    setIsSaving(true);
    try {
      await updateFAQ(selectedFAQ.id, editedFAQ);
      setFaqs(
        faqs.map((f) => (f.id === selectedFAQ.id ? { ...f, ...editedFAQ } : f))
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update FAQ: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFAQ?.id) return;
    setIsSaving(true);
    try {
      await deleteFAQ(selectedFAQ.id);
      setFaqs(faqs.filter((f) => f.id !== selectedFAQ.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete FAQ: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedFAQ(null);
    setEditedFAQ({});
  };

  // Utility to truncate description for table display
  const truncateDescription = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
        <p className="text-muted-foreground">Manage and track all frequently asked questions</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search FAQs by ID, title, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading FAQs...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>FAQ List</CardTitle>
            <CardDescription>View, edit, or delete FAQ records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FAQ ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFAQs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>{faq.id}</TableCell>
                    <TableCell>{faq.title}</TableCell>
                    <TableCell>{truncateDescription(faq.description)}</TableCell>
                    <TableCell>
                      <Badge variant={faq.enable ? "default" : "secondary"}>
                        {faq.enable ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(faq)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(faq)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(faq)}
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
                {Math.min(startIndex + itemsPerPage, filteredFAQs.length)} of{" "}
                {filteredFAQs.length} entries
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
            <DialogTitle>View FAQ</DialogTitle>
            <DialogDescription>Details of the selected FAQ</DialogDescription>
          </DialogHeader>
          {selectedFAQ && (
            <div className="space-y-4 py-4">
              <p><strong>FAQ ID:</strong> {selectedFAQ.id}</p>
              <p><strong>Title:</strong> {selectedFAQ.title}</p>
              <p><strong>Description:</strong> {selectedFAQ.description}</p>
              <p><strong>Enable:</strong> {selectedFAQ.enable ? "Yes" : "No"}</p>
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
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update FAQ details</DialogDescription>
          </DialogHeader>
          {selectedFAQ && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Title"
                value={editedFAQ.title || ""}
                onChange={(e) =>
                  setEditedFAQ({ ...editedFAQ, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                value={editedFAQ.description || ""}
                onChange={(e) =>
                  setEditedFAQ({ ...editedFAQ, description: e.target.value })
                }
                className="w-full border rounded-md p-2 h-32 resize-y"
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Enable</label>
                <select
                  className="border rounded-md p-2"
                  value={editedFAQ.enable ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedFAQ({
                      ...editedFAQ,
                      enable: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
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
            <DialogTitle>Confirm Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedFAQ && (
            <div className="space-y-4 py-4">
              <p><strong>FAQ ID:</strong> {selectedFAQ.id}</p>
              <p><strong>Title:</strong> {selectedFAQ.title}</p>
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