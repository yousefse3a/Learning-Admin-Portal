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
import { Pencil, Trash } from "lucide-react";
import {
  searchSchools,
  addSchool,
  updateSchool,
  deleteSchool,
} from "@/api/adminApis";
import { AddEditSchoolModal } from "./add_school_modal";
import { Input } from "@/components/ui/input"; // For search input

export function SchoolTable() {
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Fixed page size of 10 items per page
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await searchSchools(
        searchKeyword,
        page,
        pageSize,
        sortField,
        sortOrder
      );
      setSchools(response.Data.Data || []); // Assuming response.Data.Data contains the school list
      setTotalItems(response.Data.Count || 0); // Use Count from the response for total items
    } catch (err: any) {
      setError(err.message || "Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [searchKeyword, page, sortField, sortOrder]);

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditSchool = (school: any) => {
    setSelectedSchool(school);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteSchool = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this school?"
    );
    if (confirmed) {
      try {
        await deleteSchool(id);
        setSchools((prevSchools) =>
          prevSchools.filter((school) => school.Id !== id)
        );
        fetchSchools(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting school", err);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateSchool({ ...data, Id: selectedSchool.Id });
      } else {
        await addSchool(data);
      }
      fetchSchools(); // Refresh the list after adding or updating
      setModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1); // Toggle sort order
    } else {
      setSortField(field);
      setSortOrder(1); // Set ascending order by default
    }
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schools</h1>
        <div className="flex space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="bg-[#523397]" onClick={handleAddSchool}>Add New School</Button>
        </div>
      </div>

      {isLoading && <p>Loading schools...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && schools.length === 0 && <p>No schools found.</p>}

      {schools.length > 0 && (
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
              <TableCell className="font-bold">Active</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.Id}>
                <TableCell>{school.NameAr}</TableCell>
                <TableCell>{school.NameEn}</TableCell>
                <TableCell>{school.IsActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditSchool(school)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSchool(school.Id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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

      {/* Add/Edit School Modal */}
      {modalOpen && (
        <AddEditSchoolModal
          isEdit={isEditMode}
          schoolData={selectedSchool}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
