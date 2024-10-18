"use client";
import ChatsContacts from '@/components/ChatsContacts';
import ChattingUser from '@/components/ChattingUser';
import SearchUsername from '@/components/SearchUsername';
import UserProfile from '@/components/UserProfile';
import { User } from '@/lib/schema';
import React, { useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>();

  return (
    <SessionProvider>
      <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Mi-Chat</h1>
          <div className="flex items-center space-x-4">
            <SearchUsername setSelectedUser={setSelectedUser} setSelectedRoom={setSelectedRoom} />
            <UserProfile />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <div className="h-full border-r bg-card">
                <ChatsContacts
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setSelectedRoom={setSelectedRoom}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="h-full bg-background">
                <ChattingUser
                  selectedUser={selectedUser}
                  selectedRoom={selectedRoom}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </SessionProvider>
  );
};

export default Dashboard;