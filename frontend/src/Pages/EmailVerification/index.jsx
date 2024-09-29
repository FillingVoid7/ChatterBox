import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '/src/Store/AuthStore.js';

function EmailVerification() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { isLoading, verifyEmail } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code) {
            setError('Enter code for validation.');
            return;
        }

        setError('');

        try {
            await verifyEmail(code);
            navigate('/dashboard');
        } catch (err) {
            console.error('Verification error:',err)
            setError(err.message || 'Error verifying email.');
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-sky-300 mb-4">Verify Email</h2>
                <p className="mt-2 mb-7 text-white text-left">
                    Enter the code sent to the {email}.
                </p>
                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}
                {isLoading && (
                    <p className="text-white mb-4">Verifying...</p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
                            disabled={isLoading} 
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmailVerification;


