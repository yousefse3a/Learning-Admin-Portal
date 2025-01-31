import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // For the search input
import { Pencil, Trash } from "lucide-react"; // Icons for edit and delete
import { AddEditAdminModal } from "./add_admin_modal"; // Import AddEditAdminModal
import { getAllUsers, deleteUser } from "@/api/adminApis"; // API calls for getting and deleting users

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store selected user for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size of 10 items per page
  const [totalItems, setTotalItems] = useState(0); // Total number of items

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(
        2, // User type
        page,
        pageSize,
        searchKeyword,
        sortField,
        sortOrder
      );
      setUsers(response.Data.Data || []); // Assuming response.Data.Data contains the list of users
      setTotalItems(response.Data.Count || 0); // Use Count from the response for total items
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, searchKeyword, sortField, sortOrder]);

  // Handle adding a user
  const handleAddUser = () => {
    setSelectedUser(null); // No user selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle editing a user
  const handleEdit = (user: any) => {
    setSelectedUser(user); // Set the user data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        await deleteUser(id); // Call API to delete user
        setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== id)); // Remove from state
      } catch (err: any) {
        alert("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  // Close modal handler and refresh users after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    fetchUsers(); // Refetch users after add/edit
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
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name or email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button className="bg-[#523397]" onClick={handleAddUser}>Add New Admin</Button>
        </div>
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell
              className="font-bold cursor-pointer"
              onClick={() => handleSort("Name")}
            >
              Name {sortField === "Name" && (sortOrder === 1 ? "↑" : "↓")}
            </TableCell>
            <TableCell
              className="font-bold cursor-pointer"
              onClick={() => handleSort("Email")}
            >
              Email {sortField === "Email" && (sortOrder === 1 ? "↑" : "↓")}
            </TableCell>
            <TableCell
              className="font-bold cursor-pointer"
              onClick={() => handleSort("Phone")}
            >
              Phone {sortField === "Phone" && (sortOrder === 1 ? "↑" : "↓")}
            </TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.Id}>
              <TableCell>{user.Name}</TableCell>
              <TableCell>{user.Email}</TableCell>
              <TableCell>{user.Phone}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.Id)}
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

      {/* Modal for adding/editing user */}
      {modalOpen && (
        <AddEditAdminModal
          isEdit={isEditMode}
          adminData={selectedUser}
          open={modalOpen}
          setOpen={setModalOpen}
          onClose={closeModalAndRefresh} // Refresh users on modal close
        />
      )}
    </div>
  );
}
