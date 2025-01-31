/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import {
  searchSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/api/adminApis";
import { AddEditSubjectModal } from "./add_subject_modal";

export function SubjectsTable() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Fixed page size of 10 items per page
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await searchSubjects(searchKeyword, page, pageSize);
      setSubjects(response.Data.Data || []);
      setTotalItems(response.Data.Count || 0); // Use Count for pagination
    } catch (err: any) {
      setError(err.message || "Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [page, searchKeyword, sortField, sortOrder]);

  const handleAddSubject = () => {
    setSelectedSubject(null); // No subject selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  const handleEditSubject = (subject: any) => {
    setSelectedSubject(subject); // Set the subject data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  const handleDeleteSubject = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (confirmed) {
      try {
        await deleteSubject(id);
        fetchSubjects(); // Refresh the list after delete
      } catch (err) {
        console.error("Error deleting subject", err);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateSubject({ ...data, Id: selectedSubject.Id });
      } else {
        await addSubject(data);
      }
      fetchSubjects(); // Refresh the list after add/edit
      setModalOpen(false); // Close modal
    } catch (error: any) {
      setError(error.response?.data?.Message || "Error submitting form");
      console.error(error);
    }
  };

  // Handle sorting by column
  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === 1 ? -1 : 1); // Toggle sort order
  };

  // Pagination controls
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Table Name and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="bg-[#523397]" onClick={handleAddSubject}>Add New Subject</Button>
        </div>
      </div>

      {isLoading && <p>Loading subjects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {subjects.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("NameAr")}
                >
                  Arabic Name{" "}
                  {sortField === "NameAr" && (sortOrder === 1 ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("NameEn")}
                >
                  English Name{" "}
                  {sortField === "NameEn" && (sortOrder === 1 ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("IsActive")}
                >
                  Active Status{" "}
                  {sortField === "IsActive" && (sortOrder === 1 ? "↑" : "↓")}
                </TableCell>
                <TableCell className="font-bold">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.Id}>
                  <TableCell>{subject.NameAr}</TableCell>
                  <TableCell>{subject.NameEn}</TableCell>
                  <TableCell>
                    {subject.IsActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubject(subject.Id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1}
              variant="secondary"
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        !isLoading && <p>No subjects found.</p>
      )}

      {/* Add/Edit Subject Modal */}
      {modalOpen && (
        <AddEditSubjectModal
          isEdit={isEditMode}
          subjectData={selectedSubject}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
