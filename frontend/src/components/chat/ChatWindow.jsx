import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  addPendingMessage,
  sendMessage,
  markMessagesRead,
  clearUnreadCount,
  clearError
} from '@/store/chatSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const ChatWindow = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const prevSelectedUserRef = useRef(null);
  const navigate = useNavigate();
  const {
    selectedUser,
    currentUser,
    messages,
    pendingMessages,
    loading,
    unreadCounts,
    messageError
  } = useSelector(state => state.chatSlice);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingMessages]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      if (!prevSelectedUserRef.current || prevSelectedUserRef.current.userId !== selectedUser.userId) {
        dispatch(markMessagesRead({
          userId: currentUser.userId,
          otherUserId: selectedUser.userId
        }));
        dispatch(clearUnreadCount(selectedUser.userId));
      }
      prevSelectedUserRef.current = selectedUser;
    }
  }, [selectedUser, currentUser, dispatch]);

  useEffect(() => {
    if (selectedUser && currentUser && messages.length > 0) {
      if (unreadCounts && unreadCounts[selectedUser.userId] > 0) {
        dispatch(markMessagesRead({
          userId: currentUser.userId,
          otherUserId: selectedUser.userId
        }));
        dispatch(clearUnreadCount(selectedUser.userId));
      }
    }
  }, [messages, selectedUser, currentUser, unreadCounts, dispatch]);

  // useEffect(() => {
  //   if (messageError) {
  //     toast.error(messageError);
  //     dispatch(clearError());
  //   }
  // }, [messageError, dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser || !currentUser) return;

    if (!selectedUser.userId || !currentUser.userId) {
      toast.error("Some error has occurred!");
      navigate('/');
      return;
    }

    const tempId = uuidv4();

    const messageData = {
      tempId,
      sender: currentUser.userId,
      receiver: selectedUser.userId,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      senderRole: currentUser.role,
      receiverRole: selectedUser.role
    };

    dispatch(addPendingMessage({ ...messageData, isPending: true }));

    //send messages
    dispatch(sendMessage(messageData));
    if (messageError) {
      toast.error(messageError);
      dispatch(clearError());
    }

    setMessage('');
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  //combining confirmed and pending messages for display
  const allMessages = [
    ...messages.filter(msg =>
      (msg.sender === currentUser?.userId && msg.receiver === selectedUser?.userId) ||
      (msg.sender === selectedUser?.userId && msg.receiver === currentUser?.userId)
    ),
    ...pendingMessages.filter(msg =>
      msg.receiver === selectedUser?.userId
    )
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  //format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  };

  //group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs
    }));
  };

  const messageGroups = groupMessagesByDate(allMessages);

  if (!selectedUser) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h3 className="text-lg text-gray-500 mb-2">
            Select a {currentUser?.role === 'student' ? 'coordinator' : 'student'} to start chatting
          </h3>
          <p className="text-sm text-gray-400">
            Your conversations will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-white">
      <div className="py-3 mt-16 px-4 border-b shadow-sm bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 bg-gray-300">
            <AvatarFallback className="text-gray-500 font-medium">
              {getInitials(selectedUser?.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">{selectedUser?.name}</h2>
            {selectedUser?.branch && (
              <p className="text-xs text-gray-500">{selectedUser.branch}</p>
            )}
          </div>
        </div>
      </div>


      {/* messages */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-16 w-48 rounded-lg" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-12 w-56 rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
              </div>
            ) : allMessages.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messageGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute border-t border-gray-200 w-full"></div>
                      <span className="relative px-2 bg-white text-xs text-gray-500">
                        {new Date(group.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {group.messages.map((msg, index) => {
                      const isCurrentUser = msg.sender === currentUser?.userId;

                      return (
                        <div
                          key={index}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                            <div
                              className={`rounded-lg px-4 py-2 ${isCurrentUser
                                ? 'bg-gray-900 text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                } ${msg.isPending ? 'opacity-70' : ''}`}
                            >
                              <p className="break-words">{msg.content}</p>
                              <div className={`text-xs mt-1 flex justify-end ${isCurrentUser ? 'text-gray-100' : 'text-gray-500'
                                }`}>
                                {msg.isPending ? 'Sending...' : formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-3 border-t bg-white sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            placeholder="Type a message..."
          />
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-500 text-white rounded-md px-4"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;