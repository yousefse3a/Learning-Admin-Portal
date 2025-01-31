import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CollapseMenu from "./ui/collapse-dropdown";

interface SidebarProps {
  isOpen: boolean;

  toggleSidebar: () => void;

  activeTab: string;

  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const tabRoutes: { [key: string]: string } = {
  "/dashboard/users": "addAdmin",
  "/dashboard/school-admins": "schoolAdmin",
  "/dashboard/students": "studentUsers",
  "/dashboard/students/download": "studentUsersDownload",
  "/dashboard/add-file-student": "addFileStudent",
  "/dashboard/schools": "schools",
  "/dashboard/grades": "grades",
  "/dashboard/levels": "levels",
  "/dashboard/subjects": "subjects",
  "/dashboard/questions": "questions",
  "/dashboard/exams": "exams",
  "/dashboard/Add-model-exam": "AddModelExam",
};

function SchoolSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current path
  const activeTab =
    tabRoutes[location.pathname as keyof typeof tabRoutes] || "addAdmin";

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 h-screen overflow-x-auto bg-[#7a55cd] p-4 flex flex-col gap-4 transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out`}
    >
      <h1 className="text-white font-bold text-lg">SSP</h1>

      <button
        className={`text-left p-2 text-white text-[0.95rem] font-medium rounded-lg ${
          activeTab === "addAdmin"
            ? "bg-[#523397] text-white"
            : "hover:bg-[#3d217b] text-gray-400"
        }`}
        onClick={() => handleTabClick("/school/school-students")}
      >
        Students
      </button>

      {/* <button
        className={`text-left p-2 text-white text-[0.95rem] rounded-lg ${
          activeTab === "schoolAdmin"
            ? "bg-[#523397] text-white"
            : "hover:bg-[#3d217b] text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/school-admins")}
      >
        School Admins
      </button> */}

      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default SchoolSidebar;
