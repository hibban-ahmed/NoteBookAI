// pages/_app.js
// This file is used to initialize pages. It can be used to keep state when navigating between pages,
// or to add global CSS. Here, we'll use it to include our persistent Navbar.

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Import Link for client-side navigation
import { useRouter } from 'next/router'; // Import useRouter for programmatic navigation

// Import Firebase modules (though not strictly used for auth in this hardcoded scenario,
// it's good practice to keep the setup if planning future Firebase features)
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Keeping getFirestore for completeness

// Define global variables for Firebase configuration and app ID
// These are provided by the Canvas environment (if running in Canvas)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase app (only if config is available)
let app, db, auth;
if (Object.keys(firebaseConfig).length > 0) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.warn("Firebase config not found. Firebase features will be limited.");
}


// Navbar Component
const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full z-10 top-0 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-white text-2xl font-bold rounded-md hover:text-gray-300 transition duration-300 ease-in-out">
            AI Helper
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white text-sm">Welcome, {user.displayName || user.email || 'User'}!</span>
              <img
                src={user.photoURL || `https://placehold.co/40x40/000000/FFFFFF?text=${user.email ? user.email[0].toUpperCase() : 'U'}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
              />
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Custom Modal Component for alerts/confirmations
const CustomModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          OK
        </button>
      </div>
    </div>
  );
};


function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Only attempt Firebase auth if 'auth' object exists (i.e., firebaseConfig was not empty)
    if (auth) {
      const initializeAuth = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Firebase authentication error:", error);
          setModalMessage(`Firebase auth failed: ${error.message}`);
        } finally {
          setIsAuthReady(true);
        }
      };

      initializeAuth();

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        // If user logs out or is not authenticated, and not on the login page, redirect
        if (!currentUser && router.pathname !== '/') {
          router.push('/');
        }
      });

      return () => unsubscribe(); // Cleanup auth listener on unmount
    } else {
      // If Firebase is not initialized, assume auth is ready for hardcoded login flow
      setIsAuthReady(true);
      // For hardcoded login, we'll simulate a user object after successful login on index.js
      // This part is less critical as the actual login is handled by the FastAPI backend.
      // We can set a dummy user if the login page successfully authenticates.
    }
  }, [router]);

  const handleLogout = async () => {
    if (auth) { // Only try Firebase signOut if auth is initialized
      try {
        await signOut(auth);
        setModalMessage("Logged out successfully!");
      } catch (error) {
        console.error("Firebase logout error:", error);
        setModalMessage(`Firebase logout failed: ${error.message}`);
      }
    } else {
      // Simulate logout for hardcoded scenario
      setUser(null);
      setModalMessage("Logged out successfully!");
    }
    router.push('/'); // Always redirect to login page after logout
  };

  const showModal = (message) => {
    setModalMessage(message);
  };

  const closeModal = () => {
    setModalMessage('');
  };

  return (
    <>
      <Head>
        <title>AI Homework Helper</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
              margin-top: 64px; /* Adjust for fixed navbar height */
            }
            /* Custom scrollbar for better aesthetics */
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}
        </style>
      </Head>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="pt-16"> {/* Padding to prevent content from being hidden by fixed navbar */}
        {isAuthReady ? (
          <Component {...pageProps} user={user} showModal={showModal} setUser={setUser} />
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-xl text-gray-700">Loading application...</p>
          </div>
        )}
      </div>
      {modalMessage && <CustomModal message={modalMessage} onClose={closeModal} />}
    </>
  );
}

export default MyApp;