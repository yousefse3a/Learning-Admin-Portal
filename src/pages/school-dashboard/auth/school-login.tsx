import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./layout/login-header";
import LoginFooter from "./layout/login-footer";
import loginImg from "./../../../assets/images/login-ill.svg";
import { adminSchoolLogin } from "@/api/adminApis";
import "./layout/login-layout.css";

export default function SchoolLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    //watch,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await adminSchoolLogin(data.username, data.password);
      console.log("Login successful:", response);
      navigate("/school/school-students");
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  //   const onSubmit = (data) => {
  //     console.log(data);
  //   };
  //   const onSubmit = async (data) => {
  //     console.log(data);
  //     try {
  //       const response = await axios.post(USERS_URLS.login, data);
  //       const profile = response.data.data.profile;
  //       dispatch(loginAction(response.data.data));
  //       navigate("/dashboard");
  //       localStorage.setItem("accessToken", response.data.data.accessToken);
  //       localStorage.setItem("profile", JSON.stringify(profile));
  //       toast.success(response?.data?.message || t("welcome_toast"));
  //       console.log("Success:", response);
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         toast.error(error.response?.data?.message || t("some_thing_wrong"));
  //       }
  //     }
  //   };

  return (
    <div className="mt-5">
      <LoginHeader
        leftChildren={
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/about">Contact Us</a>
            </li>
          </ul>
        }
        rightChildren={
          <div
            className="
        flex
        gap-4
        "
          >
            <button
              className="login-btn"
              onClick={() =>
                navigate(
                  "https://sah-platform-web-ccekg8f2gce3evgt.canadacentral-01.azurewebsites.net/pre-login"
                )
              }
            >
              Login
            </button>

            <div className="header-circle"></div>
          </div>
        }
      />
      <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={loginImg}
            alt="Students"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Login as a School</h2>

          <div className="">
            <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
              {/* Display login error message */}
              {loginError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {loginError}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full h-[57px] p-2 border rounded-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "user name is required",
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full h-[57px] p-2 border rounded-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full h-[57px] text-[14px] font-bold bg-[#9A7ED9] text-white rounded-none hover:bg-purple-700 transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <LoginFooter />
    </div>
  );
}
