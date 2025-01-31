import { LoginForm } from "@/components/login-form";
import React from "react";
import Images from "@/assets/images/Images";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left panel with gradient background */}
      {/* <div className="flex flex-1 bg-gradient-to-b from-gray-800 to-gray-600 text-white p-8 lg:w-1/2 flex-col justify-between"> */}
      <div className="flex flex-1 bg-[#7a55cd] text-white p-8 lg:w-1/2 flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">SSP</h1>
        </div>
        <div className="flex justify-center items-center h-full">
          {/* <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p> */}
          <img className="w-[60%]" src={Images.login_banner} alt="pic" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 justify-center items-center p-8 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
