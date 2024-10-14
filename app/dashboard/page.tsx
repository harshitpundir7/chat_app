"use client";

import ChatsContacts from '@/components/ChatsContacts';
import ChattingUser from '@/components/ChattingUser';
import SearchUsername from '@/components/SearchUsername'
import { User } from '@/lib/schema';
import React, { useState } from 'react'
import { SessionProvider } from "next-auth/react"

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>();

  return (
          <SessionProvider>

    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-center p-4 border-b">
        <SearchUsername setSelectedUser={setSelectedUser} setSelectedRoom={setSelectedRoom} />
      </header>
      
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 border-r overflow-y-auto">
          <ChatsContacts 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser} 
            setSelectedRoom={setSelectedRoom}
            />
        </aside>
        
        <section className="flex-1 overflow-hidden">
          <ChattingUser selectedUser={selectedUser}
          selectedRoom={selectedRoom}
          />
        </section>
      </main>
    </div>
          </SessionProvider>
  )
}

export default Dashboard