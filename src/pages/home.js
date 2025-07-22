// pages/home.js
// This is the homepage after login. It contains the card to navigate to the AI homework helper.

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HomePage = ({ user }) => {
  const router = useRouter();

  // Redirect to login if user is not authenticated (based on frontend state)
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
          Hello, {user?.displayName || user?.email || 'User'}!
        </h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Welcome to your personalized learning dashboard. Get ready to boost your studies with AI!
        </p>

        <div className="flex justify-end mb-8"> {/* Position card to top right */}
          <Link href="/ai-helper" className="block">
            <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer max-w-xs w-full border-b-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">AI Homework Helper</h2>
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.636 19.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12H4m1.636-6.364l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help with your assignments, summaries, and explanations.
              </p>
              <span className="text-purple-600 font-semibold text-sm flex items-center">
                Start Learning
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Placeholder for other homepage content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-blue-400">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Recent Activity</h3>
            <p className="text-gray-600">No recent activity. Start using the AI Helper!</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Learning Resources</h3>
            <p className="text-gray-600">Explore new topics and expand your knowledge.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Progress Tracker</h3>
            <p className="text-gray-600">Track your learning journey and achievements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;