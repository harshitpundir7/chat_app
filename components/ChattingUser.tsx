"use client"
import { Message, ServerMessage, User } from '@/lib/schema'
import React, { useEffect, useState, useCallback } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { useSession } from "next-auth/react"
import { uploadOnRedis } from '@/lib/actions/RedisMessageUpload'
import { GetRoomMessage } from '@/lib/actions/ChatWithUser'

const ChattingUser = ({ selectedUser, selectedRoom }: { selectedUser: User | null, selectedRoom: string | undefined }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState(''); 
  const { data: session } = useSession();
  const currentUserId = parseInt(session?.user?.id as string);

  useEffect(() => {
    if (!selectedUser || !selectedRoom) return;
    
    async function loadMessage() {
      const fetchedMessages = await GetRoomMessage(selectedRoom as string);
      setMessages(fetchedMessages);
    }
    loadMessage();
    const socket = new WebSocket("ws://localhost:8080/");

    socket.onopen = () => {
      console.log("Connected to server");
      socket.send(JSON.stringify({ type: "join", roomId: selectedRoom }));
    }

    socket.onmessage = (e) => {
      try {
        const serverMessage:ServerMessage = JSON.parse(e.data);
        setMessages(prevMessages => [...prevMessages, serverMessage.message]);
      } catch (err) {
        console.error("Error parsing JSON:", err, "Message received:", e.data);
      }
    };
    
    socket.onerror = (err) => {
      console.error("Error in WebSocket client side:", err);
    }

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setMessages([]);
    }

    setWs(socket);

    return () => {
      socket.close();
    }
  }, [selectedUser, selectedRoom]);

  const sendMessage = useCallback(async() => {
    if (ws && ws.readyState === WebSocket.OPEN && inputMessage.trim()) {
      
      const msg:Message = {
        from: currentUserId,
        to: selectedUser?.id as number,
        content: inputMessage
      }

      ws.send(JSON.stringify({ type: 'message', content: msg }));
      setMessages(prevMessages => [...prevMessages, msg]);
      setInputMessage('');
      await uploadOnRedis(msg,selectedRoom as string);
    }
  }, [ws,inputMessage,selectedUser, session]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a user to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className='p-4 flex items-center border-b sticky top-0 bg-background z-10'>
        <Avatar>
          <AvatarImage className='bg-zinc-800' src={selectedUser.avatar as string} />
        </Avatar>
        <div className='ml-3 font-medium'>{selectedUser.username}</div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.from === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}>
            <Card className={`max-w-[70%] ${msg.from === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <CardContent className="p-3">
                {msg.content}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className='p-4 border-t'>
        <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input
            type='text'
            className="flex-grow"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}

export default ChattingUser;