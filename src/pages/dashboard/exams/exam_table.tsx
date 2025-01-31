/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import ExamModal from "./exam-modal";
import { BASE_IMG_URL } from "@/api/imageInstance";
import ConfirmDelete from "@/components/shared/modals/confirm-delete";
import { formatDatType } from "@/components/shared/date-format/date-format";
import EditExamModal from "./edit-exam-modal";
import { GetExams, DeleteExams } from "@/api/services/exam.services";
import Images from "@/assets/images/Images";

export default function ExamTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setDeleteIsLoading] = useState(false);
  const [ExamsList, setExamsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [titleName, setTitleName] = useState();
  const [examItemId, setExamItemId] = useState<number>(0);
  //update
  const [isUpdateLoading, setUpdateIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [examListItem, setExamListItem] = useState();

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  console.log("ExamsList", ExamsList);
  const handleDeleteExam = async (id) => {
    console.log(id);
    try {
      setDeleteIsLoading(true);
      await DeleteExams(id);
      fetchExams();
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete exam:", error);
    } finally {
      setDeleteIsLoading(false);
    }
  };

  // Fetch Exams
  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const payload = {
        Keyword: searchKeyword,
        Page: page,
        Size: pageSize,
      };
      const response = await GetExams(payload);
      setExamsList(response.data.Data.Data || []);
      setTotalItems(response.data.Data.Count || 0);
      setTitleName(response.data.Data.Data.TitleEn);
      //console.log(response.data.Data.Data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting by column
  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === 1 ? -1 : 1);
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

  useEffect(() => {
    fetchExams();
  }, [page, searchKeyword, sortField, sortOrder]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> Exams</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button
            className="bg-[#523397]"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Exam
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <img className="w-[100px]" src={Images.loader_1} alt="Loading..." />
        </div>
      ) : (
        <>
          {error && <p className="text-red-500">Error: {error}</p>}

          {ExamsList.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Name", "Subject", "Grade", "Round", "From", "To"].map((field) => (
                      <TableCell
                        key={field}
                        className="font-bold cursor-pointer"
                        onClick={() => handleSort(field)}
                      >
                        {field.replace(/([A-Z])/g, " $1")}{" "}
                        {sortField === field && (sortOrder === 1 ? "↑" : "↓")}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ExamsList.map((item) => (
                    <TableRow key={item?.ExamId}>
                      <TableCell>{item?.TitleEn}</TableCell>
                      <TableCell>{item?.SubjectNameEn}</TableCell>
                      <TableCell>{item?.GradeNameEn}</TableCell>
                      <TableCell>{item?.Round}</TableCell>
                      <TableCell>{formatDatType(item?.From)}</TableCell>
                      <TableCell>{formatDatType(item?.To)}</TableCell>
                      {/* <TableCell>{item?.From}</TableCell>
                      <TableCell>{item?.To}</TableCell> */}
                      {/* <TableCell>
                        <img
                          className="w-10 h-7"
                          src={
                            item?.Imag
                              ? `${BASE_IMG_URL}/${item.Imag}`
                              : Images.default_picture_icon
                          }
                          alt="pic"
                        />
                      </TableCell> */}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setExamItemId(item?.ExamId);
                              setIsUpdateModalOpen(true);
                              setTitleName(item.TitleEn);
                              setExamListItem((prev) => item);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setExamItemId(item.ExamId);
                              setTitleName(item.TitleEn);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
            <p>No subjects found.</p>
          )}
        </>
      )}

      <div className="mt-10"></div>

      <ExamModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fetchExam={fetchExams}
        //onSubmit={onSubmit}
      />

      <EditExamModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        updatedTitle={titleName}
        editExamData={examListItem}
        fetchExam={fetchExams}
      />

      <ConfirmDelete
        isModalOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        handleDelete={() => handleDeleteExam(examItemId)}
        loading={isDeleteLoading}
        deleteItem={titleName}
      />
    </div>
  );
}
