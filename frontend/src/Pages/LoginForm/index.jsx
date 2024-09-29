import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '/src/Store/AuthStore.js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useAuthStore((state) => ({
        login: state.login,
        error: state.error,
        isLoading: state.isLoading
    }));
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Enter your email and password.');
            return;
        }

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-sky-300 mb-4">ChatterBox</h1>
                <p className="text-lg text-white mb-8">Stay Connected with Friends Near and Far.</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-2 px-3 border-b-2 border-opacity-50 border-white bg-transparent text-white placeholder-opacity-70 placeholder-white focus:outline-none"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 mb-4">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-white">
                    <Link to="/forgot-password" className="text-white">
                        Forgot password?
                    </Link>
                </p>
                <hr className="my-4 border-t-2 border-opacity-10 border-white" />
                <p className="mt-4 text-white">
                    <Link to="/signup" className="text-white">
                        Create New Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;


