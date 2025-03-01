import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GetStudentsExams } from "@/api/services/student.services";
import StudentSubjectSelect from "./subject-select";
import AcademicYearSelect from "./academic-year-select";
import StudentExamSelect from "./exam-select";
import Images from "@/assets/images/Images";
import "./students-exams.css";

export default function StudentsExams() {
  const [isLoading, setIsLoading] = useState(false);
  const [ExamsList, setExamsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);

  const [selectedSubject, setSelectedSubject] = useState(""); // Track selected subject
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(""); // Track selected academic year

  // Log selected subject ID
  console.log("Selected Subject ID:", selectedSubject);

  // Log selected academic year ID
  console.log("Selected Academic Year ID:", selectedAcademicYear);

  // Fetch Exams
  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const payload = {
        Keyword: searchKeyword,
        Page: page,
        Size: pageSize,
        SubjectId: selectedSubject,
        AcademicYearId: selectedAcademicYear,
      };
      const response = await GetStudentsExams(payload);
      setExamsList(response.data.Data.Data || []);
      setTotalItems(response.data.Data.Count || 0);
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
    if (selectedSubject && selectedAcademicYear) {
      fetchExams();
    } else {
      setExamsList([]); // Clear the table when no filters are selected
    }
  }, [
    page,
    searchKeyword,
    sortField,
    sortOrder,
    selectedSubject,
    selectedAcademicYear,
  ]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Exams</h1>
      </div>

      <div className="flex gap-4">
        <div
          className="min-w-fit md:min-w-[15%] lg:min-w-[15%]"
          id="student_subject_select"
        >
          <StudentSubjectSelect
            name="SubjectId"
            value={selectedSubject}
            onChange={setSelectedSubject}
          />
        </div>

        <div className="">
          <AcademicYearSelect
            name="AcademicYearId"
            value={selectedAcademicYear}
            onChange={setSelectedAcademicYear}
          />
        </div>
        <div className="">
          <StudentExamSelect
            name="AcademicYearId"
            value={selectedAcademicYear}
            onChange={setSelectedAcademicYear}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <img className="w-[100px]" src={Images.loader_1} alt="Loading..." />
        </div>
      ) : (
        <>
          {/* {error && <p className="text-red-500">Error: {error}</p>} */}

          {ExamsList.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Code", "Name", "School", "Grade", "Level", "Skills"].map(
                      (field) => (
                        <TableCell
                          key={field}
                          className="font-bold cursor-pointer"
                          onClick={() => handleSort(field)}
                        >
                          {field.replace(/([A-Z])/g, " $1")}{" "}
                          {sortField === field && (sortOrder === 1 ? "↑" : "↓")}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ExamsList.map((item) => (
                    <TableRow key={item?.StudentId}>
                      <TableCell>#{item?.StudentCode}</TableCell>
                      <TableCell>{item?.StudentName}</TableCell>
                      <TableCell>{item?.SchoolName}</TableCell>
                      <TableCell>{item?.GradeName || "N/A"}</TableCell>
                      <TableCell>{item?.LevelName || "N/A"}</TableCell>
                      <TableCell>
                        {Array.isArray(item?.SkillsStudent) &&
                        item.SkillsStudent.length > 0
                          ? item.SkillsStudent.map((skill, index) => (
                              <div key={index}>{skill.Skill}</div>
                            ))
                          : "N/A"}
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
            <p>No exams found.</p>
          )}
        </>
      )}
    </div>
  );
}
