"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation'

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole === 'worker') {
      router.push('/worker/dashboard')
    } else if (selectedRole === 'manager') {
      router.push('/manager/dashboard')
    }
    else if (selectedRole === 'admin') {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-black group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#333333] px-10 py-3 dark:border-b-gray-300">
          <div className="flex items-center gap-4 text-[#FFFFFF] dark:text-black">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path
                    d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect width="48" height="48" fill="white"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Chariot</h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            {/* Card Container */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h1 className="text-[#FFFFFF] dark:text-black text-[25px] font-bold leading-tight tracking-[-0.015em] px-4 text-center pb-3 pt-5">
                Welcome to Chariot
              </h1>
              <p className="text-[#FFFFFF] dark:text-black text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                Please select your role and enter your access code or username and password
              </p>
              <div className="flex justify-center">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                  <Button
                    className={`min-w-[84px] h-10 ${selectedRole === "worker" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#333333] text-white"}`}
                    onClick={() => handleRoleSelect("worker")}
                  >
                    Worker
                  </Button>
                  <Button
                    className={`min-w-[84px] h-10 ${selectedRole === "manager" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#333333] text-white"}`}
                    onClick={() => handleRoleSelect("manager")}
                  >
                    Manager
                  </Button>
                  <Button
                    className={`min-w-[84px] h-10 ${selectedRole === "admin" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#333333] text-white"}`}
                    onClick={() => handleRoleSelect("admin")}
                  >
                    Admin
                  </Button>
                </div>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-center justify-center gap-4 px-4 py-3 mx-auto">
                <label className="flex flex-col min-w-[160px] flex-1 text-center">
                  <p className="text-[#FFFFFF] dark:text-black text-base font-bold leading-normal pb-2">
                    Access code
                  </p>
                  <Input placeholder="Enter your 6-digit access code" />
                </label>
              </div>

              <p className="text-[#CBCBCB] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center dark:text-gray-600">
                or
              </p>
              <div className="flex max-w-[480px] flex-wrap items-center justify-center gap-4 px-4 py-3 mx-auto">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] dark:text-black text-base font-bold leading-normal pb-2">Username</p>
                  <Input placeholder="Enter your username" />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-center justify-center gap-4 px-4 py-3 mx-auto">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] dark:text-black text-base font-bold leading-normal pb-2">Password</p>
                  <Input placeholder="Enter your password" type="password" />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-center justify-center gap-4 px-4 py-3 mx-auto mt-4">
                <Button
                  onClick={handleLogin}
                  className="w-full font-bold text-[#FFFFFF] h-10 bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
