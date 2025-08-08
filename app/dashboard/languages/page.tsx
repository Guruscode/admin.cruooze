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
import { getAllLanguages, updateLanguage, deleteLanguage, Language } from "@/lib/languageService";

export default function LanguageManagementPage() {
  const { user: authUser } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedLanguage, setEditedLanguage] = useState<Partial<Language>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchLanguages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLanguages = await getAllLanguages();
        setLanguages(fetchedLanguages);
      } catch (err: any) {
        console.error("Error in fetchLanguages:", err);
        setError(
          `Failed to fetch languages: ${err.message}. Please check Firebase configuration, collection existence, or permissions.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const filteredLanguages = languages.filter(
    (language) =>
      language.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLanguages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLanguages = filteredLanguages.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (language: Language) => {
    setSelectedLanguage(language);
    setViewModalOpen(true);
  };

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language);
    setEditedLanguage({ ...language });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLanguage?.id) return;
    setIsSaving(true);
    try {
      await updateLanguage(selectedLanguage.id, editedLanguage);
      setLanguages(
        languages.map((l) => (l.id === selectedLanguage.id ? { ...l, ...editedLanguage } : l))
      );
      setEditModalOpen(false);
    } catch (err: any) {
      setError(`Failed to update language: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (language: Language) => {
    setSelectedLanguage(language);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLanguage?.id) return;
    setIsSaving(true);
    try {
      await deleteLanguage(selectedLanguage.id);
      setLanguages(languages.filter((l) => l.id !== selectedLanguage.id));
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(`Failed to delete language: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedLanguage(null);
    setEditedLanguage({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Language Management</h1>
        <p className="text-muted-foreground">Manage and track all languages in the system</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search languages by ID, code, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading languages...</div>
      )}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Language List</CardTitle>
            <CardDescription>View, edit, or delete language records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead>RTL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLanguages.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell>{language.id}</TableCell>
                    <TableCell>{language.code}</TableCell>
                    <TableCell>{language.name}</TableCell>
                    <TableCell>
                      <Badge variant={language.enable ? "default" : "secondary"}>
                        {language.enable ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={language.isRtl ? "default" : "secondary"}>
                        {language.isRtl ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(language)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(language)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(language)}
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
                {Math.min(startIndex + itemsPerPage, filteredLanguages.length)} of{" "}
                {filteredLanguages.length} entries
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
            <DialogTitle>View Language</DialogTitle>
            <DialogDescription>Details of the selected language</DialogDescription>
          </DialogHeader>
          {selectedLanguage && (
            <div className="space-y-4 py-4">
              <p><strong>Language ID:</strong> {selectedLanguage.id}</p>
              <p><strong>Code:</strong> {selectedLanguage.code}</p>
              <p><strong>Name:</strong> {selectedLanguage.name}</p>
              <p><strong>Enable:</strong> {selectedLanguage.enable ? "Yes" : "No"}</p>
              <p><strong>Is RTL:</strong> {selectedLanguage.isRtl ? "Yes" : "No"}</p>
              <p><strong>Is Deleted:</strong> {selectedLanguage.isDeleted ? "Yes" : "No"}</p>
              <p><strong>Image:</strong> {selectedLanguage.image ? <a href={selectedLanguage.image} target="_blank" rel="noopener noreferrer">View Image</a> : "N/A"}</p>
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
            <DialogTitle>Edit Language</DialogTitle>
            <DialogDescription>Update language details</DialogDescription>
          </DialogHeader>
          {selectedLanguage && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Code"
                value={editedLanguage.code || ""}
                onChange={(e) =>
                  setEditedLanguage({ ...editedLanguage, code: e.target.value })
                }
              />
              <Input
                placeholder="Name"
                value={editedLanguage.name || ""}
                onChange={(e) =>
                  setEditedLanguage({ ...editedLanguage, name: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                value={editedLanguage.image || ""}
                onChange={(e) =>
                  setEditedLanguage({ ...editedLanguage, image: e.target.value })
                }
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Enable</label>
                <select
                  className="border rounded-md p-2"
                  value={editedLanguage.enable ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedLanguage({
                      ...editedLanguage,
                      enable: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Is RTL</label>
                <select
                  className="border rounded-md p-2"
                  value={editedLanguage.isRtl ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedLanguage({
                      ...editedLanguage,
                      isRtl: e.target.value === "Yes",
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
                  value={editedLanguage.isDeleted ? "Yes" : "No"}
                  onChange={(e) =>
                    setEditedLanguage({
                      ...editedLanguage,
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
            <DialogTitle>Confirm Delete Language</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this language? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedLanguage && (
            <div className="space-y-4 py-4">
              <p><strong>Language ID:</strong> {selectedLanguage.id}</p>
              <p><strong>Code:</strong> {selectedLanguage.code}</p>
              <p><strong>Name:</strong> {selectedLanguage.name}</p>
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