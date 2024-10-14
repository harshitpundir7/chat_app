import React, { useEffect, useState, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChatWithOtherUser } from '@/lib/actions/ChatWithUser';
import { ChatRoom, User } from '@/lib/schema';

interface ChatsContactsProps {
  setSelectedUser: (user: User) => void;
  selectedUser: User | null;
  setSelectedRoom : (chatRoomId : string) => void;
}

function ChatsContacts({ setSelectedUser, selectedUser,setSelectedRoom  }: ChatsContactsProps) {
  const [chatRoomsWithOtherUsers, setChatRoomsWithOtherUsers] = useState<ChatRoom[]>([]);

  const fetchChatRooms = useCallback(async () => {
    try {
      const responseFromAction = await ChatWithOtherUser();
      setChatRoomsWithOtherUsers(responseFromAction);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      // Optionally, set an error state here to show to the user
    }
  }, []);
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms,selectedUser]);

  const handleClick = useCallback((user: User,chatRoomId : string) => {
    setSelectedUser(user);
    setSelectedRoom(chatRoomId);
  }, [setSelectedUser,setSelectedRoom]);

  return (
    <div className="overflow-y-auto h-full">
      {chatRoomsWithOtherUsers.map(chatroom => (
        <div 
          key={chatroom.id} 
          onClick={() => handleClick(chatroom.users[0],chatroom.id)} 
          className={`flex items-center p-4 cursor-pointer hover:bg-zinc-800 transition-colors duration-200 ${
            selectedUser?.id === chatroom.users[0].id ? 'bg-zinc-800' : 'bg-zinc-900'
          }`}
        >
          <Avatar className='bg-zinc-800'>
            <AvatarImage src={chatroom.users[0].avatar as string} alt={chatroom.users[0].username} />
            <AvatarFallback>{chatroom.users[0].username[0]}</AvatarFallback>
          </Avatar>
          <div className='ml-3'>{chatroom.users[0].username}</div>
        </div>
      ))}
    </div>
  )
}

export default ChatsContacts;