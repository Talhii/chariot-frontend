"use client"
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "react-toastify";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setUsername("")
    setPassword("")
  }

  const handleLogin = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      let response;

      if (selectedRole === "worker") {
        response = await axios.post(`${apiBaseUrl}/login`, {
          accessCode,
          role: "Worker",
        });

        if (response?.data?.success) {
          localStorage.setItem("token", response?.data?.token);
          router.push(`/${selectedRole}/dashboard`);
        } else {
          setErrorMessage("Login failed. Please check your credentials.")
        }
      } else if (selectedRole === "manager" || selectedRole === "admin") {
        response = await axios.post(`${apiBaseUrl}/login`, {
          username,
          password,
          role: selectedRole === "manager" ? "Manager" : "Admin",
        })

        if (response?.data?.success) {
          localStorage.setItem("token", response?.data?.token);
          router.push(`/${selectedRole}/dashboard`)
        } else {
          setErrorMessage("Login failed. Please check your credentials.")
        }
      }
    } catch (error) {
      console.error("Error during login:", error)
      setErrorMessage("Login failed. Please check your credentials.")
    }
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-gray-950 to-black group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">

        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <Card className="w-full max-w-[512px] bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <div className="w-full h-16">
                <img src="/logo.jpg" alt="Logo" className="w-[150px] h-auto object-cover mb-4 mx-auto" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white">Welcome to Chariot</CardTitle>
              <p className="text-gray-300 text-center mt-2">Please select your role and enter your credentials</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="flex flex-1 gap-3 flex-wrap justify-center">
                  <Button
                    className={`min-w-[84px] ${selectedRole === "worker" ? "bg-red-500 hover:bg-red-400" : "bg-white hover:bg-gray-200 text-black"}`}
                    onClick={() => handleRoleSelect("worker")}
                  >
                    Worker
                  </Button>
                  <Button
                    className={`min-w-[84px] ${selectedRole === "manager" ? "bg-red-500 hover:bg-red-400" : "bg-white hover:bg-gray-200 text-black"}`}
                    onClick={() => handleRoleSelect("manager")}
                  >
                    Manager
                  </Button>
                  <Button
                    className={`min-w-[84px] ${selectedRole === "admin" ? "bg-red-500 hover:bg-red-400" : "bg-white hover:bg-gray-200 text-black"}`}
                    onClick={() => handleRoleSelect("admin")}
                  >
                    Admin
                  </Button>

                </div>
              </div>

              {selectedRole === "worker" && (
                <div className="space-y-4">
                  <label className="block w-full flex justify-center items-center">
                    <div className="text-center">
                      <span className="text-white text-sm font-medium mb-1 block">Access Code</span>
                      <InputOTP
                        maxLength={6}
                        value={accessCode}
                        onChange={(value) => setAccessCode(value)}
                        className="flex justify-center items-center"
                      >
                        <InputOTPGroup className="flex">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </label>

                </div>
              )}

              {(selectedRole === "manager" || selectedRole === "admin") && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-white text-sm font-medium mb-1 block">Username</span>
                    <Input
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-white text-sm font-medium mb-1 block">Password</span>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </label>
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleLogin}
                  className="w-full font-bold bg-white text-black hover:bg-gray-200 hover:text-black"
                >
                  Login
                </Button>


                {errorMessage && <p className="text-red-400 text-sm text-center mt-2">{errorMessage}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}