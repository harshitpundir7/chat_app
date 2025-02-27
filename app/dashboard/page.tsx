"use client";
import { ChatRoom, Message, User } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import "../globals.css"
import { MessagesSquare, } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatSidebar from '@/components/ChatSidebar';
import { ChatWithOtherUser } from '@/lib/actions/ChatWithUser';
import ConversationalPanel from '@/components/ConversationalPanel';

interface ExtendedUser extends User {
  isOnline: boolean;
}

interface ExtendedChatRoom extends ChatRoom {
  users: ExtendedUser[];
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [activeChat, setActiveChat] = useState<ExtendedChatRoom>();
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [ws, setWs] = useState<WebSocket>();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null)
  const [activeButton, setActiveButton] = useState<string>("message");
  const [chatsData, setChatsData] = useState<{ groupsData: ChatRoom[]; singleChatData: ChatRoom[] }>();

  //get chat data
  async function getChatData() {
    const result = await ChatWithOtherUser();
    console.log(result)
    setChatsData(result);
  }

  useEffect(() => {
    const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/';

    getChatData();


    if (!webSocketUrl) {
      console.error("WebSocket URL is not defined");
      return;
    }

    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      // Automatically connect when socket opens
      if (session?.user?.id) {
        socket.send(JSON.stringify({
          type: "connect",
          userId: parseInt(session.user.id)
        }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        handleMessage(parsedData);

      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [session?.user?.id, status]);

  //handle messsage
  function handleMessage(data: any) {
    switch (data.type) {
      case "connectedUsers": setOnlineUsers(data.message)
        break;
      case "connection": console.log("connected to server");
        break;
      case "join": console.log('connection to room successfully established')
        break;
      case "message": setIncomingMessage(data.message)
        break;
      default: console.log(data);
    }
  }

  return (
    <div className="flex h-screen text-gray-300/90 overflow-hidden bg-DarkNavy">
      <main className='h-screen w-full' >
        <ResizablePanelGroup direction='horizontal' >
          <ResizablePanel className='' minSize={15} maxSize={30} defaultSize={20} >
            <div className='' >
              <nav className='flex justify-between items-center py-6 px-4 border-b border-white/10 ' >
                <div className='flex h-8 w-8 bg- space-x-2 items-center' >
                  <div className='bg-gradient-to-br from-MineBlue flex justify-between items-center border-white/70 border via-MinePink to-MineDarkYellow p-2 text-center rounded-full' >
                    <MessagesSquare className='text-white/70' />
                  </div>
                  <span className='text-base text-white font-semibold' >connect</span>
                </div>
                <div className='flex items-center gap-3' >
                  <div className='text-white/30 text-2xl ' >
                    +
                  </div>
                  <Avatar className='h-8 w-8' >
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </div>
              </nav>
              {/* sub-section sidebar */}
              <div className='h-screen ' >
                <ChatSidebar chatsData={chatsData!} ws={ws!} userId={parseInt(session?.user?.id!)} setActiveChat={setActiveChat} activeChat={activeChat!} onlineUsers={onlineUsers} />
              </div>
            </div>

          </ResizablePanel>
          <ResizableHandle className='bg-white/10 text-white/10' />
          <ResizablePanel className='' defaultSize={80} >
            <ConversationalPanel ws={ws!} setIncomingMessage={setIncomingMessage} userId={parseInt(session?.user?.id!)} activeChat={activeChat!} incomingMessage={incomingMessage!} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main >
    </div>
  );
};

export default Dashboard;
