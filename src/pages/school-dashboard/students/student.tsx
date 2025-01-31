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
import { getAllUsers, deleteUser } from "@/api/adminApis";
import { useGradeSearch } from "@/hooks/useGradesSearch";
import AddStudentModal from "./add-student-modal";
import StudentCard from "./student-card";
import UpdateStudentCard from "./update-student-card";
import ConfirmDelete from "@/components/shared/modals/confirm-delete";
import { StudentFilePage } from "@/pages/dashboard/student/download_students";
import { AddFileStudentForm } from "@/components/add-file-student";
import "./students.css";

export function SchoolStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the selected student for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open
  const [titleName, setTitleName] = useState<string | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteLoading, setDeleteIsLoading] = useState(false);
  const [studentItemId, setStudentItemId] = useState<string>("");

  const [currentView, setCurrentView] = useState<
    "download" | "upload" | "none"
  >("none"); // New state to control the view

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch grades
  const { grades } = useGradeSearch();

  // Fetch students
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(
        4, // User type for students
        page,
        pageSize,
        searchKeyword,
        sortField,
        sortOrder
      );
      const fetchedStudents = response.Data.Data || [];
      setStudents(fetchedStudents);
      setTotalItems(response.Data.Count || 0);

      if (fetchedStudents.length > 0) {
        setSelectedStudent(fetchedStudents[0]); // Set the first student as default selected
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize, searchKeyword, sortField, sortOrder]);

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      setDeleteIsLoading(true);
      await deleteUser(id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.Id !== id)
      );
    } catch (error) {
      console.error("Error deleting student", error);
    } finally {
      setDeleteIsLoading(false);
      closeDeleteModal();
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

  // Close modal handler and refresh students after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    fetchStudents(); // Refetch students after add/edit
  };

  // Handle student row selection
  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setCurrentView("none"); // Reset to show StudentCard when a student is selected
  };

  return (
    <div className="w-full">
      {/* Header with Table Name, Search, and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>

        <div className="file_buttons flex flex-wrap gap-2">
          <Button onClick={() => setCurrentView("upload")}>Upload File</Button>
          <Button onClick={() => setCurrentView("download")}>
            Download File
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name or email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="light_btn" onClick={() => setIsAddModalOpen(true)}>
            Add New Student
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-9">
          {isLoading && <p>Loading students...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Empty State */}
          {!isLoading && students.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold">No Students Found</h2>
              <p className="text-gray-500">
                Get started by adding a new student.
              </p>
            </div>
          )}

          {/* Table */}
          {students.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Code</TableCell>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">School</TableCell>
                  <TableCell className="font-bold">Class</TableCell>
                  <TableCell className="font-bold">Grade</TableCell>
                  <TableCell className="font-bold">Level</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student?.Id}
                    onClick={() => handleSelectStudent(student)} // Select student on row click
                  >
                    <TableCell>
                      <span className="table_item_bx box_shadow">
                        #{student?.StudentCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="table_item_bx box_shadow">
                        {student?.StudentName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="table_item_bx box_shadow">
                        {student?.SchoolName || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="table_item_bx box_shadow break-words">
                        {student?.ClassName || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="table_item_bx box_shadow whitespace-nowrap">
                        {student?.GradeName || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="table_item_bx box_shadow whitespace-nowrap">
                        {student?.LevelName || "N/A"}
                      </span>
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
        </div>

        {/* Student Details or File Components Display */}
        <div className="col-span-12 md:col-span-3">
          {selectedStudent && !isEditMode && currentView === "none" && (
            <StudentCard
              selectedStudent={selectedStudent}
              openDeleteModal={(studentId: string, studentName: string) => {
                setStudentItemId(studentId);
                setTitleName(studentName);
                setIsDeleteModalOpen(true);
              }}
              onEditClick={() => setIsEditMode(true)} // Set edit mode when the edit icon is clicked
            />
          )}

          {selectedStudent && isEditMode && currentView === "none" && (
            <UpdateStudentCard
              selectedStudent={selectedStudent}
              onCancel={() => setIsEditMode(false)} // Cancel editing and go back to view mode
              fetchStudents={fetchStudents}
            />
          )}

          {/* Show the file components in the place of student card */}
          <div className="student_files">
            {currentView === "download" && <StudentFilePage />}
            {currentView === "upload" && <AddFileStudentForm />}
          </div>
        </div>
      </div>

      {/* Add student Modal */}
      <AddStudentModal
        isModalOpen={isAddModalOpen}
        onClose={closeAddModal}
        fetchStudents={fetchStudents}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isModalOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        handleDelete={() => handleDelete(studentItemId)}
        loading={isDeleteLoading}
        deleteItem={titleName}
      />
    </div>
  );
}
