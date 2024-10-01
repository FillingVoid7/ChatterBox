import React, { useState } from 'react';
import { useAuthStore } from '/src/Store/AuthStore.js';

function ForgotPasswordModal() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuthStore();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage('Your password reset link has been sent to your email.');
      setError('');
    } catch (err) {
      setError(err.message || 'Email not found');
      setMessage('');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600">
      <div className="text-center w-full max-w-sm">
        <h3 className="text-4xl font-bold text-sky-300 mb-4">Forgot Password</h3>
        <p className="text-white mb-4 text-left">Enter your email address for a reset link.</p>

        <form className="space-y-6" onSubmit={handleSendResetLink}>
          <div>
            <input
              type="email"
              placeholder="someone@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 w-full"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-green-300 mt-4">{message}</p>}
        {error && <p className="text-red-300 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
