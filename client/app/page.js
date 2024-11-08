'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/firebase/firebaseconfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Header from '@/components/Header';
import StreamChatComponent from '@/components/ChatComponent';

const HomePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserID] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [allUserIds, setAllUserIds] = useState([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);
          try {
            const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);
            setIsRegistered(response.data.exists);
            setUserID(response.data.userId);
            const usersResponse = await axios.get("http://localhost:3001/api/auth/users");
            setAllUserIds(usersResponse.data);
            console.log("alluserIds", usersResponse.data);
            console.log("userId", response.data.userId);
          } catch (error) {
            console.error('Error checking registration status:', error);
          }
        } else {
          setIsAuthenticated(false);
          setIsRegistered(false);
          router.push('/auth');
        }
        setLoading(false);
      });
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setIsRegistered(false);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMessageClick = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Header handleLogout={handleLogout} handleMessageClick={handleMessageClick} userId={userId} />
          {isChatOpen && (
            <div className="chat-overlay">
              <div className="chat-popup">
                <button className="close-btn" onClick={closeChat}>
                  X
                </button>
                <StreamChatComponent userId={userId} allUserIds={allUserIds} />
              </div>
              <div className="backdrop" onClick={closeChat} />
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default HomePage;