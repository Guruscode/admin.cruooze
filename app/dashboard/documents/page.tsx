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
  getAllDocuments,
  getAllDriverDocuments,
  updateDocument,
  updateDriverDocument,
  deleteDocument,
  deleteDriverDocumentItem,
  Document,
  DriverDocument,
  DriverDocumentItem,
} from "@/lib/driverDocumentService";

interface CombinedDocument {
  driverId: string;
  documentItem: DriverDocumentItem;
  documentTitle: string;
}

export default function DriverDocumentManagementPage() {
  const { user: authUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [driverDocuments, setDriverDocuments] = useState<DriverDocument[]>([]);
  const [combinedDocuments, setCombinedDocuments] = useState<CombinedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<CombinedDocument | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<Document | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMetadataModalOpen, setEditMetadataModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMetadataModalOpen, setDeleteMetadataModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedDocumentItem, setEditedDocumentItem] = useState<Partial<DriverDocumentItem>>({});
  const [editedMetadata, setEditedMetadata] = useState<Partial<Document>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedDocuments, fetchedDriverDocuments] = await Promise.all([
          getAllDocuments(),
          getAllDriverDocuments(),
        ]);
        setDocuments(fetchedDocuments);
        setDriverDocuments(fetchedDriverDocuments);

        // Combine driver documents with document metadata
        const combined = fetchedDriverDocuments.flatMap((driverDoc) =>
          driverDoc.documents.map((docItem) => ({
            driverId: driverDoc.id,
            documentItem: docItem,
            documentTitle:
              fetchedDocuments.find((doc) => doc.id === docItem.documentId)?.title ||
              "Unknown",
          }))
        );
        setCombinedDocuments(combined);
      } catch (err: any) {
        console.error("Error in fetchData:", err);
        setError(
          `Failed to fetch documents or driver documents: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDocuments = combinedDocuments.filter(
    (doc) =>
      doc.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentItem.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentItem.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = (doc: CombinedDocument) => {
    setSelectedDocument(doc);
    setSelectedMetadata(documents.find((d) => d.id === doc.documentItem.documentId) || null);
    setViewModalOpen(true);
  };

  const handleEditDocumentItem = (doc: CombinedDocument) => {
    setSelectedDocument(doc);
    setEditedDocumentItem({ ...doc.documentItem });
    setEditModalOpen(true);
  };

  const handleEditMetadata = (doc: CombinedDocument) => {
    const metadata = documents.find((d) => d.id === doc.documentItem.documentId);
    if (metadata) {
      setSelectedMetadata(metadata);
      setEditedMetadata({ ...metadata });
      setEditMetadataModalOpen(true);
    }
  };

  const handleSaveEditDocumentItem = async () => {
    if (!selectedDocument?.driverId) return;
    setIsSaving(true);
    try {
      const driverDoc = driverDocuments.find((d) => d.id === selectedDocument.driverId);
      if (!driverDoc) throw new Error("Driver document not found");
      const updatedDocuments = driverDoc.documents.map((item) =>
        item.documentId === selectedDocument.documentItem.documentId
          ? { ...item, ...editedDocumentItem }
          : item
      );
      await updateDriverDocument(selectedDocument.driverId, {
        documents: updatedDocuments,
      });
      setDriverDocuments(
        driverDocuments.map((d) =>
          d.id === selectedDocument.driverId ? { ...d, documents: updatedDocuments } : d
        )
      );
      setCombinedDocuments(
        combinedDocuments.map((c) =>
          c.driverId === selectedDocument.driverId &&
          c.documentItem.documentId === selectedDocument.documentItem.documentId
            ? { ...c, documentItem: { ...c.documentItem, ...editedDocumentItem } }
            : c
        )
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update driver document item: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditMetadata = async () => {
    if (!selectedMetadata?.id) return;
    setIsSaving(true);
    try {
      await updateDocument(selectedMetadata.id, editedMetadata);
      setDocuments(
        documents.map((d) => (d.id === selectedMetadata.id ? { ...d, ...editedMetadata } : d))
      );
      setCombinedDocuments(
        combinedDocuments.map((c) =>
          c.documentItem.documentId === selectedMetadata.id
            ? { ...c, documentTitle: editedMetadata.title || c.documentTitle }
            : c
        )
      );
      setEditMetadataModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update document metadata: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDocumentItem = (doc: CombinedDocument) => {
    setSelectedDocument(doc);
    setDeleteModalOpen(true);
  };

  const handleDeleteMetadata = (doc: CombinedDocument) => {
    const metadata = documents.find((d) => d.id === doc.documentItem.documentId);
    if (metadata) {
      setSelectedMetadata(metadata);
      setDeleteMetadataModalOpen(true);
    }
  };

  const confirmDeleteDocumentItem = async () => {
    if (!selectedDocument?.driverId || !selectedDocument?.documentItem.documentId) return;
    setIsSaving(true);
    try {
      const driverDoc = driverDocuments.find((d) => d.id === selectedDocument.driverId);
      if (!driverDoc) throw new Error("Driver document not found");
      const documentIndex = driverDoc.documents.findIndex(
        (item) => item.documentId === selectedDocument.documentItem.documentId
      );
      if (documentIndex === -1) throw new Error("Document item not found");
      await deleteDriverDocumentItem(selectedDocument.driverId, documentIndex);
      setDriverDocuments(
        driverDocuments.map((d) =>
          d.id === selectedDocument.driverId
            ? {
                ...d,
                documents: d.documents.filter(
                  (item) => item.documentId !== selectedDocument.documentItem.documentId
                ),
              }
            : d
        )
      );
      setCombinedDocuments(
        combinedDocuments.filter(
          (c) =>
            !(
              c.driverId === selectedDocument.driverId &&
              c.documentItem.documentId === selectedDocument.documentItem.documentId
            )
        )
      );
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete driver document item: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteMetadata = async () => {
    if (!selectedMetadata?.id) return;
    setIsSaving(true);
    try {
      await deleteDocument(selectedMetadata.id);
      setDocuments(documents.filter((d) => d.id !== selectedMetadata.id));
      setCombinedDocuments(
        combinedDocuments.map((c) =>
          c.documentItem.documentId === selectedMetadata.id
            ? { ...c, documentTitle: "Unknown" }
            : c
        )
      );
      setDeleteMetadataModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete document metadata: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setEditMetadataModalOpen(false);
    setDeleteModalOpen(false);
    setDeleteMetadataModalOpen(false);
    setSelectedDocument(null);
    setSelectedMetadata(null);
    setEditedDocumentItem({});
    setEditedMetadata({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Driver Document Management</h1>
        <p className="text-muted-foreground">
          Manage and track all driver documents and their metadata
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by driver ID, document ID, title, or document number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">
          Loading driver documents...
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
            <CardTitle>Driver Document List</CardTitle>
            <CardDescription>View, edit, or delete driver document records and metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc) => (
                  <TableRow key={`${doc.driverId}-${doc.documentItem.documentId}`}>
                    <TableCell>{doc.driverId}</TableCell>
                    <TableCell>{doc.documentTitle}</TableCell>
                    <TableCell>{doc.documentItem.documentNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doc.documentItem.status === "Approved" ? "default" : "secondary"
                        }
                      >
                        {doc.documentItem.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.documentItem.verified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDocumentItem(doc)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit Document
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMetadata(doc)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit Metadata
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDocumentItem(doc)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete Document
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMetadata(doc)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete Metadata
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
                {Math.min(startIndex + itemsPerPage, filteredDocuments.length)} of{" "}
                {filteredDocuments.length} entries
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
            <DialogTitle>View Driver Document</DialogTitle>
            <DialogDescription>Details of the selected driver document and metadata</DialogDescription>
          </DialogHeader>
          {selectedDocument && selectedMetadata && (
            <div className="space-y-4 py-4">
              <p><strong>Driver ID:</strong> {selectedDocument.driverId}</p>
              <p><strong>Document Title:</strong> {selectedDocument.documentTitle}</p>
              <p><strong>Document ID:</strong> {selectedDocument.documentItem.documentId}</p>
              <p><strong>Document Number:</strong> {selectedDocument.documentItem.documentNumber || "N/A"}</p>
              <p><strong>Status:</strong> {selectedDocument.documentItem.status || "N/A"}</p>
              <p><strong>Verified:</strong> {selectedDocument.documentItem.verified ? "Yes" : "No"}</p>
              <p><strong>Expire At:</strong> {selectedDocument.documentItem.expireAt?.toLocaleString() || "N/A"}</p>
              <p><strong>Front Image:</strong> {selectedDocument.documentItem.frontImage ? <a href={selectedDocument.documentItem.frontImage} target="_blank" rel="noopener noreferrer">View Image</a> : "N/A"}</p>
              <p><strong>Back Image:</strong> {selectedDocument.documentItem.backImage ? <a href={selectedDocument.documentItem.backImage} target="_blank" rel="noopener noreferrer">View Image</a> : "N/A"}</p>
              <p><strong>Metadata - Back Side:</strong> {selectedMetadata.backSide ? "Yes" : "No"}</p>
              <p><strong>Metadata - Enable:</strong> {selectedMetadata.enable ? "Yes" : "No"}</p>
              <p><strong>Metadata - Expire At:</strong> {selectedMetadata.expireAt ? "Yes" : "No"}</p>
              <p><strong>Metadata - Front Side:</strong> {selectedMetadata.frontSide ? "Yes" : "No"}</p>
              <p><strong>Metadata - Is Deleted:</strong> {selectedMetadata.isDeleted ? "Yes" : "No"}</p>
              <Button onClick={closeModal} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Item Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver Document</DialogTitle>
            <DialogDescription>Update driver document details</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Document Number"
                value={editedDocumentItem.documentNumber || ""}
                onChange={(e) =>
                  setEditedDocumentItem({
                    ...editedDocumentItem,
                    documentNumber: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Front Image URL"
                value={editedDocumentItem.frontImage || ""}
                onChange={(e) =>
                  setEditedDocumentItem({
                    ...editedDocumentItem,
                    frontImage: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Back Image URL"
                value={editedDocumentItem.backImage || ""}
                onChange={(e) =>
                  setEditedDocumentItem({
                    ...editedDocumentItem,
                    backImage: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Status"
                value={editedDocumentItem.status || ""}
                onChange={(e) =>
                  setEditedDocumentItem({ ...editedDocumentItem, status: e.target.value })
                }
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Verified</label>
                <select
                  className="border rounded-md p-2"
                  value={editedDocumentItem.verified ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedDocumentItem({
                      ...editedDocumentItem,
                      verified: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <Input
                placeholder="Expire At (YYYY-MM-DD)"
                value={
                  editedDocumentItem.expireAt
                    ? editedDocumentItem.expireAt.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedDocumentItem({
                    ...editedDocumentItem,
                    expireAt: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                type="date"
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditDocumentItem} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Modal */}
      <Dialog open={editMetadataModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Metadata</DialogTitle>
            <DialogDescription>Update document metadata details</DialogDescription>
          </DialogHeader>
          {selectedMetadata && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Title"
                value={editedMetadata.title || ""}
                onChange={(e) =>
                  setEditedMetadata({ ...editedMetadata, title: e.target.value })
                }
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Back Side</label>
                <select
                  className="border rounded-md p-2"
                  value={editedMetadata.backSide ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedMetadata({
                      ...editedMetadata,
                      backSide: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Enable</label>
                <select
                  className="border rounded-md p-2"
                  value={editedMetadata.enable ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedMetadata({
                      ...editedMetadata,
                      enable: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Expire At</label>
                <select
                  className="border rounded-md p-2"
                  value={editedMetadata.expireAt ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedMetadata({
                      ...editedMetadata,
                      expireAt: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Front Side</label>
                <select
                  className="border rounded-md p-2"
                  value={editedMetadata.frontSide ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedMetadata({
                      ...editedMetadata,
                      frontSide: e.target.value === "Yes",
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
                  value={editedMetadata.isDeleted ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedMetadata({
                      ...editedMetadata,
                      isDeleted: e.target.value === "Yes",
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
                <Button onClick={handleSaveEditMetadata} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Document Item Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete Driver Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Driver ID:</strong> {selectedDocument.driverId}
              </p>
              <p>
                <strong>Document Title:</strong> {selectedDocument.documentTitle}
              </p>
              <p>
                <strong>Document Number:</strong>{" "}
                {selectedDocument.documentItem.documentNumber || "N/A"}
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteDocumentItem}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{" "}
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Metadata Modal */}
      <Dialog open={deleteMetadataModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete Document Metadata</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document metadata? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMetadata && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Document ID:</strong> {selectedMetadata.id}
              </p>
              <p>
                <strong>Title:</strong> {selectedMetadata.title}
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteMetadata}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{" "}
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}