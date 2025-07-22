// pages/index.js
// This is your login page. It sends credentials to the FastAPI backend.

import React, { useState } from 'react';
import { useRouter } from 'next/router';

// IMPORTANT: This URL will be loaded from a Vercel environment variable (NEXT_PUBLIC_BACKEND_URL)
// For local development, set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 in a .env.local file
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const LoginPage = ({ showModal, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);

    if (!BACKEND_URL) {
      showModal("Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        showModal(data.message);
        // Simulate a user object for the frontend state after successful login
        setUser({ displayName: username, email: `${username}@example.com`, photoURL: null });
        router.push('/home'); // Redirect to home page on successful login
      } else {
        const errorData = await response.json();
        showModal(`Login failed: ${errorData.detail || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error("Login request error:", error);
      showModal(`Network error during login: ${error.message}. Is the backend running at ${BACKEND_URL}?`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome Back!</h1>
        <p className="text-lg text-gray-600 mb-8">Please log in to access the AI Homework Helper.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-gray-500 text-sm">
          Use the hardcoded credentials: Username: `user`, Password: `password123` (or as set in Railway env vars).
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
