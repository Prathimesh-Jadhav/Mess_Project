import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password/${token}`, { password });
      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border border-gray-300 rounded mt-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full mt-2 p-2 bg-green-600 text-white rounded"
      >
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
