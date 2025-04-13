import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUnreadCount, getConversation, markMessagesRead, selectUser } from '@/store/chatSlice';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import SearchBar from '../shared/SearchBar';

const UserList = () => {
  const dispatch = useDispatch();
  const { users: stateUsers, selectedUser, currentUser, unreadCounts } = useSelector(state => state.chatSlice);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("");


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSelectUser = (user) => {
    dispatch(selectUser(user));
    if (currentUser) {
      dispatch(getConversation({
        userId: currentUser.userId,
        otherUserId: user.userId
      }));

      dispatch(markMessagesRead({
        userId: currentUser.userId,
        otherUserId: user.userId
      }));

      dispatch(clearUnreadCount(user.userId));
    }
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

  const users = stateUsers.filter(user =>
    user.name.toLowerCase().includes(input.toLowerCase()) ||
    (user.branch && user.branch.toLowerCase().includes(input.toLowerCase()))
  );


  return (
    <Card className={`${isMobile ? 'sm:w-5/12 max-w-xs' : 'w-1/4'} border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300`}>
      <div className=" mt-16 text-center border-b border-gray-200 bg-white">
        {!isMobile && (
          <h2 className="text-xl pb-4 font-semibold text-gray-800">
            {currentUser?.role === 'student' ? 'Coordinators' : 'Students'}
          </h2>
        )}
      </div>
      {!isMobile ? (
        <div className='px-3'>

          <SearchBar
            input={input}
            settingInput={setInput}
            text="filter by name or branch"
          />
        </div>) : null
      }

      <ScrollArea className="flex-1">
        {users.length === 0 ? (
          <div className={`${isMobile ? 'p-6' : 'p-6'} text-center text-gray-500`}>
            {!isMobile && "No users available"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map(user => (
              <div
                key={user.userId}
                className={`cursor-pointer hover:bg-gray-300 transition-colors flex items-center 
                         ${isMobile ? 'p-2 gap-3' : 'p-3 justify-between'} 
                          ${selectedUser?.userId === user.userId ? 'bg-gray-500 border-l-4 border-gray-900' : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-3'}`}>
                  <div className="relative min-w-[2.5rem]">
                    <Avatar className="h-10 w-10 bg-gray-300">
                      <AvatarFallback className="text-gray-500 font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    {isMobile && unreadCounts && unreadCounts[user.userId] > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs bg-green-600 text-white"
                      >
                        {unreadCounts[user.userId]}
                      </Badge>
                    )}
                  </div>

                  {isMobile ? (
                    <p className="text-sm font-medium text-gray-800">
                      {user.name.split(' ')[0]}
                    </p>
                  ) : (
                    <div>
                      <h3 className={`font-medium ${selectedUser?.userId === user.userId ? 'text-white' : 'text-gray-800'}`}>
                        {user.name}
                      </h3>
                      {user.branch && (
                        <p className={`font-sm ${selectedUser?.userId === user.userId ? 'text-white' : 'text-gray-800'}`}>
                          {user.branch}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {!isMobile && unreadCounts && unreadCounts[user.userId] > 0 && (
                  <Badge className="bg-green-500 text-white rounded-full">
                    {unreadCounts[user.userId]}
                  </Badge>
                )}
              </div>
            ))}

          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default UserList;