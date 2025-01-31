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
import { Input } from "@/components/ui/input"; // For search input
import { Pencil, Trash } from "lucide-react"; // Icons for edit and delete
import {
  searchGrades,
  addGrade,
  updateGrade,
  deleteGrade,
} from "@/api/adminApis"; // Replace with actual path
import { AddEditGradeModal } from "./add_grade_modal";

export function GradesTable() {
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Fixed page size of 10 items per page
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await searchGrades(searchKeyword, page, pageSize);
      setGrades(response.Data.Data || []); // Assuming response.Data.Data contains the list of grades
      setTotalItems(response.Data.Count || 0); // Use Count from the response for total items
    } catch (err: any) {
      setError(err.message || "Failed to fetch grades");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [page, searchKeyword, sortField, sortOrder]);

  const handleAddGrade = () => {
    setSelectedGrade(null); // No grade selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  const handleEditGrade = (grade: any) => {
    setSelectedGrade(grade); // Set the grade data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  const handleDeleteGrade = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (confirmed) {
      try {
        await deleteGrade(id); // Call API to delete grade
        fetchGrades(); // Refresh the list after delete
      } catch (err) {
        console.error("Error deleting grade", err);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateGrade({ ...data, Id: selectedGrade.Id });
      } else {
        await addGrade(data);
      }
      fetchGrades(); // Refresh the list after add/edit
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
        <h1 className="text-2xl font-bold">Grades</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="bg-[#523397]" onClick={handleAddGrade}>Add New Grade</Button>
        </div>
      </div>

      {isLoading && <p>Loading grades...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {grades.length > 0 ? (
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
              {grades.map((grade) => (
                <TableRow key={grade.Id}>
                  <TableCell>{grade.NameAr}</TableCell>
                  <TableCell>{grade.NameEn}</TableCell>
                  <TableCell>
                    {grade.IsActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditGrade(grade)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGrade(grade.Id)}
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
        !isLoading && <p>No grades found.</p>
      )}

      {/* Add/Edit Grade Modal */}
      {modalOpen && (
        <AddEditGradeModal
          isEdit={isEditMode}
          gradeData={selectedGrade}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
