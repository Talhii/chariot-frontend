"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const roles = ["Admin", "Manager", "Worker"];

export default function AddUser() {
  return (
    <SidebarProvider>
      <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
        <AppSidebar className="dark hidden md:block" />
        <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
          <Component />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export const Component = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleAccessCodeChange = (e) => setAccessCode(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    const newUser = {
      fullName,
      role,
      username: role === "Worker" ? undefined : username,
      password: role === "Worker" ? undefined : password,
      accessCode: role === "Worker" ? accessCode : undefined,
      file: image ? image : undefined, // Pass image as file
    };

    const formData = new FormData();
    Object.keys(newUser).forEach((key) => {
      if (newUser[key]) {
        if (key === "file") {
          formData.append(key, e.target.image.files[0]); // Append the image file
        } else {
          formData.append(key, newUser[key]);
        }
      }
    });

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${apiBaseUrl}/admin/user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("User Created Successfully:", response.data);
      router.push("/admin/user");
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "An error occurred while creating the user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
      <div className="p-8 w-full">
        <h2 className="text-3xl font-semibold text-white mb-8">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-lg text-gray-400 mb-2">Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {(role === "Admin" || role === "Manager") && (
            <div>
              <label className="block text-lg text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="e.g., johndoe"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                required
              />
            </div>
          )}

          {(role === "Admin" || role === "Manager") && (
            <div>
              <label className="block text-lg text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                required
              />
            </div>
          )}

          {role === "Worker" && (
            <div>
              <label className="block text-lg text-gray-400 mb-2">Access Code</label>
              <input
                type="text"
                value={accessCode}
                onChange={handleAccessCodeChange}
                placeholder="Access Code"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-lg text-gray-400 mb-2">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
            />
            {image && (
              <div className="mt-4">
                <img src={image} alt="Image Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 bg-white text-black rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
