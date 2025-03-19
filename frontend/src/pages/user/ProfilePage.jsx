// ProfilePage.jsx
import React, { useState } from 'react';
import avatar from '../../assets/avatar (2).png';

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Update password
    setUserData({
      ...userData,
      password: "••••••••" // Masked password for display
    });
    
    // Reset form
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
    setError("");
    setSuccess("Password updated successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary px-4 py-5 sm:px-6">
          <h1 className="text-xl font-bold text-white">User Profile</h1>
        </div>
        
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="text-center">
            <img
              src={userData.avatarUrl}
              alt="User avatar"
              className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-gray-200"
            />
            <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <dl>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.name}</dd>
            </div>
            
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Mobile number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.mobileNumber}</dd>
            </div>
            
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                {userData.password}
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
            <form onSubmit={handlePasswordUpdate} className="mt-4">
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
                
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {success && (
            <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;