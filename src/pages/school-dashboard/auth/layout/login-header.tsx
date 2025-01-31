import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

interface HeaderProps {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
}

const LoginHeader: React.FC<HeaderProps> = ({ leftChildren, rightChildren }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // make loggedIn a varibl check the toket key in the local storage
  const loggedIn = localStorage.getItem("token") ? true : false; // check if the user is logged in or not
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-header flex justify-between items-center p-4">
      <div className="flex items-center gap-6">{leftChildren}</div>
      <div className="flex items-center gap-4 relative">
        {rightChildren}
        {loggedIn && (
          <div className="relative mt-1">
            <button
              className="text-gray-800 font-medium focus:outline-none"
              onClick={handleToggleDropdown}
            >
              <AiOutlineLogout size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginHeader;
