// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import avatar from '../assets/avatar (2).png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  // Sample user data - in a real app, this would come from your backend
  const [userData, setUserData] = useState({
    name: "John Doe",
    mobileNumber: "+1 (555) 123-4567",
    password: "••••••••",
    avatarUrl: avatar
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);


  const { id } = useParams();

  useEffect(() => {
    fetchUserData();
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getUser/${id}`);
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    //basic validation:
    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/updateUser/${id}`, { password: newPassword,mobileNumber:id });
      if (response.data.success) {
        toast.success(response.data.message)
        setIsEditing(false);
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('error in updating user data');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center mt-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary px-4 py-5 sm:px-6">
          <h1 className="text-xl font-bold text-white">User Profile</h1>
        </div>

        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="text-center">
            <img
              src={avatar}
              alt="User avatar"
              className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-gray-200"
            />
            <h2 className="text-2xl font-bold text-gray-800">{userData[0]?.name}</h2>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <dl>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData[0]?.name}</dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Mobile number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData[0]?.mobileNumber}</dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center text-gray-500">
                password hashed
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 rounded-md"
                >
                  {isEditing ? "Cancel" : "Change"}
                </button>
              </dd>
            </div>
          </dl>

          {isEditing && (
            <div  className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitForm}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;