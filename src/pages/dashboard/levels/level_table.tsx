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
  searchLevels,
  addLevel,
  updateLevel,
  deleteLevel,
} from "@/api/adminApis";
import { AddEditLevelModal } from "./add_level_modal";

export function LevelsTable() {
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination, search, and sorting state
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Fixed page size
  const [totalItems, setTotalItems] = useState<number>(0);

  // Fetch levels
  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      const response = await searchLevels(
        searchKeyword,
        page,
        pageSize,
        sortField,
        sortOrder
      );
      setLevels(response.Data.Data || []);
      setTotalItems(response.Data.Count || 0); // Total items for pagination
    } catch (err: any) {
      setError(err.message || "Failed to fetch levels");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, [searchKeyword, page, sortField, sortOrder]);

  const handleAddLevel = () => {
    setSelectedLevel(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditLevel = (level: any) => {
    setSelectedLevel(level);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteLevel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this level?"
    );
    if (confirmed) {
      try {
        await deleteLevel(id);
        fetchLevels(); // Refresh after deletion
      } catch (err) {
        console.error("Error deleting level", err);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateLevel({ ...data, Id: selectedLevel.Id });
      } else {
        await addLevel(data);
      }
      setModalOpen(false); // Close modal
      fetchLevels(); // Refresh the list
    } catch (error: any) {
      setError(error.response?.data?.Message || "Error saving level");
    }
  };

  // Sorting logic
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
      {/* Header with search and add button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Levels</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="bg-[#523397]" onClick={handleAddLevel}>Add New Level</Button>
        </div>
      </div>

      {isLoading && <p>Loading levels...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {levels.length > 0 ? (
        <>
          {/* Table */}
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
              {levels.map((level) => (
                <TableRow key={level.Id}>
                  <TableCell>{level.NameAr}</TableCell>
                  <TableCell>{level.NameEn}</TableCell>
                  <TableCell>
                    {level.IsActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLevel(level)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLevel(level.Id)}
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
        !isLoading && <p>No levels found.</p>
      )}

      {/* Add/Edit Level Modal */}
      {modalOpen && (
        <AddEditLevelModal
          isEdit={isEditMode}
          levelData={selectedLevel}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
