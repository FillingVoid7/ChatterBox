import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '/src/Store/AuthStore.js'; 

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const { token } = useParams(); 
  const { resetPassword } = useAuthStore(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await resetPassword(token, newPassword); 
      console.log('Password reset successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Error resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600">
      <div className="text-center w-full max-w-sm">
        <h3 className="text-4xl font-bold text-sky-300 mb-4">Reset Password</h3>
        <p className="text-white mb-6 text-left">Enter a new password for your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="py-2 px-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 w-full">
              Done
            </button>
            {error && <p className="text-red-300 mt-4">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
