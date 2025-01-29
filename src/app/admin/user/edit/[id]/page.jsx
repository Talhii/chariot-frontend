"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const roles = ["Admin", "Manager", "Worker"];

export default function EditUser({ params }) {
  const userId = use(params)?.id;

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${apiBaseUrl}/admin/user/${userId}`);
          const user = response.data.data;

          setFullName(user.fullName || "");
          setRole(user.role || "");
          setUsername(user.username || "");
          setAccessCode(user.accessCode || "");
          setImage(user.profileImage || null);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Error fetching user data.");
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleAccessCodeChange = (e) => setAccessCode(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    const updatedUser = {
      fullName,
      role,
      username: role === "Worker" ? undefined : username,
      password: password ? password : undefined,
      accessCode: role === "Worker" ? accessCode : undefined,
      file: image ? image : undefined,
    };

    const formData = new FormData();
    Object.keys(updatedUser).forEach((key) => {
      if (updatedUser[key]) {
        if (key === "file" && image) {
          formData.append(key, e.target.image.files[0]);
        } else {
          formData.append(key, updatedUser[key]);
        }
      }
    });

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.put(`${apiBaseUrl}/admin/user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("User Updated Successfully:", response.data);
      router.push("/admin/user");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "An error occurred while updating the user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
      <div className="p-8 w-full">
        <h2 className="text-3xl font-semibold text-white mb-8">Edit User</h2>
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
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
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
              className={`px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
