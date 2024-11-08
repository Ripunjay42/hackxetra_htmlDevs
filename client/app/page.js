// frontend/app/page.js
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/firebase/firebaseconfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const HomePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserID] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      // Listen to Firebase authentication state
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);

          try {
            // Check registration status via the API
            const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);
            setIsRegistered(response.data.exists);
            setUserID(response.data.userId);

          } catch (error) {
            console.error('Error checking registration status:', error);
          }
        } else {
          setIsAuthenticated(false);
          setIsRegistered(false);
        }

        setLoading(false);
      });
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      setIsAuthenticated(false);
      setIsRegistered(false);
      router.push('/auth'); // Redirect to auth page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>

        {isAuthenticated && isRegistered ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
