import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '/src/Store/AuthStore.js';
function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const { signup, error, isLoading, setError } = useAuthStore();

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, firstName, lastName);
      if (!error && !isLoading) {
        navigate('/signup-with-email', { state: { email } });
      } else {
        console.error(error);
      }
    } catch (err) {
      console.log("Error in HandleSubmit:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-sky-300 mb-4">Sign Up For ChatterBox</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="someone@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          {isLoading && (
            <p className="text-white mb-4">Loading...</p>
          )}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
