import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, getUsers } from '@/store/chatSlice';
import ChatWindow from '@/components/chat/ChatWindow';
import UserList from '@/components/chat/UserList';
import CoordinatorHeader from '@/components/shared/CoordinatorHeader';
import Header from '@/components/shared/Header';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authSlice);
  const { isConnected } = useSelector(state => state.chatSlice);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(user && user.role !== 'coordinator' && user.role !== 'student') {
      toast.error("You are not allowed to view this resource");
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (user && !isConnected) {
      dispatch(connectSocket({
        userId: user._id,
        role: user.role,
        name: user.name
      }));
    }
  }, [user, isConnected, dispatch]);

  useEffect(() => {
    if (isConnected && user) {
      dispatch(getUsers(user.role));
    }
  }, [isConnected, user, dispatch]);



  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-20">
        {user && user.role === 'student' ? <Header/> : <CoordinatorHeader/>}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <UserList />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;