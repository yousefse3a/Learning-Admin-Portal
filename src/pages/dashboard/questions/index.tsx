/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import ConfirmDelete from "@/components/shared/modals/confirm-delete";
import {
  GetModelExam,
  DeleteModelExams,
} from "@/api/services/model-exam.services";
import Images from "@/assets/images/Images";
import { BASE_IMG_URL } from "@/api/imageInstance";

const ModelExamTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setDeleteIsLoading] = useState(false);
  const [modelExamsList, setModelExamsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examModelItemId, setExamModelItemId] = useState<number>(0);
  const [titleName, setTitleName] = useState();
  const navigate = useNavigate();

  // Fetch Model Exams
  const fetcModelhExams = async () => {
    setIsLoading(true);
    try {
      const payload = {
        Keyword: searchKeyword,
        Page: page,
        Size: pageSize,
      };
      const response = await GetModelExam(payload);
      setModelExamsList(response.data.Data.Data || []);
      setTotalItems(response.data.Data.Count || 0);
      setTitleName(response.data.Data.Data.NameEn);
      console.log(response.data.Data.Data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteExam = async (id) => {
    console.log(id);
    try {
      setDeleteIsLoading(true);
      await DeleteModelExams(id);
      fetcModelhExams();
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete exam:", error);
    } finally {
      setDeleteIsLoading(false);
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
    fetcModelhExams();
  }, [page, searchKeyword, sortField, sortOrder]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Exam models</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button
            className="bg-[#523397]"
            onClick={() => navigate("/dashboard/Add-model-exam")}
          >
            Add Exam model
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

          {modelExamsList.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* {["Name", "Subjec tName", "piece", "Topic", "Image"].map((field) => ( */}
                    {["Name", "Subjec tName", "Grade", "Level"].map((field) => (
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
                  {modelExamsList.map((item) => (
                    <TableRow key={item?.ExamId}>
                      <TableCell>{item?.NameEn}</TableCell>
                      <TableCell>{item?.SubjectName}</TableCell>
                      <TableCell>{item?.GradeName}</TableCell>
                      <TableCell>{item?.LevelName}</TableCell>
                      {/* <TableCell>{item?.piece}</TableCell> */}
                      {/* <TableCell>{item?.Topics.TitleAr}</TableCell>
                      <TableCell>
                        <img
                          className="w-10 h-7"
                          src={
                            item?.Imag
                              ? `${BASE_IMG_URL}/${item?.Topics?.File}`
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
                              navigate(`/dashboard/edit-model-exam/${item.Id}`);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setExamModelItemId(item.Id);
                              setTitleName(item.NameEn);
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

      <ConfirmDelete
        isModalOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        handleDelete={() => handleDeleteExam(examModelItemId)}
        loading={isDeleteLoading}
        deleteItem={titleName}
      />
    </div>
  );
};

export default ModelExamTable;
