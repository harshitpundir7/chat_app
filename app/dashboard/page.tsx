"use client";
import ChatsContacts from '@/components/ChatsContacts';
import SearchUsername from '@/components/SearchUsername';
import UserProfile from '@/components/UserProfile';
import { Message, User } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ChattingUser from '@/components/ChattingUser';
import "../globals.css"
import { Cloud, MessageCircle, MessagesSquare, Plus, Radio, Settings, UserIcon, } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatSidebar from '@/components/ChatSidebar';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [ws, setWs] = useState<WebSocket>();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [incomingMessage, setIncomingMessage] = useState<Message>()
  const [activeButton, setActiveButton] = useState<string>("message");

  useEffect(() => {
    const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/';

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
          userId: session.user.id
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

  function handleMessage(data: any) {
    switch (data.type) {
      case "connectedUsers": setOnlineUsers(data.message)
        break;
      case "connection": console.log("connected to server");
        break;
      case "join": console.log("connection to room successfully established")
        break;
      case "message": setIncomingMessage(data.message)
        break;
      default: console.log(data);
    }
  }

  return (
    <div className="flex h-screen text-gray-300/90 bg-DarkNavy">
      <main className='h-screen w-full' >
        <ResizablePanelGroup direction='horizontal' >
          <ResizablePanel className='' defaultSize={20} >
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
                <ChatSidebar />
              </div>
            </div>

          </ResizablePanel>
          <ResizableHandle className='bg-white/10 text-white/10' />
          <ResizablePanel className='' defaultSize={80} >
            <div className='' >
              <div className='w-full border-b border-white/10 px-6 py-7' >
                hello
              </div>
              {/* chatting section */}
              <div className='h-screen bg-DarkIndigo w-full ' >

                <ResizablePanelGroup direction="horizontal" >
                  <ResizablePanel defaultSize={100} >
                  </ResizablePanel>
                  <ResizableHandle className='bg-white/10' />
                  <ResizablePanel defaultSize={0} >
                  </ResizablePanel>
                </ResizablePanelGroup>


              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main >
      {/* <header className="flex items-center justify-between p-4 border-b border-white/10 bg-darkIndigo shadow-sm"> */}
      {/*   <h1 className="text-3xl font-bold text-white "> */}
      {/*     <MessagesSquare /> */}
      {/*   </h1> */}
      {/*   <div className="flex items-center space-x-4"> */}
      {/*     <SearchUsername setSelectedUser={setSelectedUser} setSelectedRoom={setSelectedRoom} /> */}
      {/*     <UserProfile /> */}
      {/*   </div> */}
      {/* </header> */}
      {/* <main className="flex-1 overflow-hidden"> */}
      {/*   <ResizablePanelGroup direction='horizontal'> */}
      {/*     <ResizablePanel defaultSize={25} minSize={20} maxSize={40}> */}
      {/*       <div className="h-full border-r bg-darkIndigo/50"> */}
      {/*         <ChatsContacts */}
      {/*           selectedUser={selectedUser} */}
      {/*           setSelectedUser={setSelectedUser} */}
      {/*           setSelectedRoom={setSelectedRoom} */}
      {/*           ws={ws as WebSocket} */}
      {/*         /> */}
      {/*       </div> */}
      {/*     </ResizablePanel> */}
      {/*     <ResizableHandle withHandle /> */}
      {/*     <ResizablePanel defaultSize={75}> */}
      {/*       <div className="h-full bg-darkIndigo/30"> */}
      {/*         <ChattingUser */}
      {/*           incomingMessage={incomingMessage!} */}
      {/*           selectedUser={selectedUser} */}
      {/*           selectedRoom={selectedRoom} */}
      {/*           ws={ws as WebSocket} */}
      {/*           onlineUsers={onlineUsers} */}
      {/*         /> */}
      {/*       </div> */}
      {/*     </ResizablePanel> */}
      {/*   </ResizablePanelGroup> */}
      {/* </main> */}
    </div >
  );
};

export default Dashboard;
