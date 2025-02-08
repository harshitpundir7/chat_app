"use client"
import { Message, User } from '@/lib/types'
import React, { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { useSession } from "next-auth/react"
import { ScrollArea } from './ui/scroll-area'
import { uploadOnRedis } from '@/lib/actions/RedisMessageUpload'


const ChattingUser = ({ selectedUser, selectedRoom, ws, onlineUsers, incomingMessage }: { incomingMessage: Message, selectedUser: User | null, selectedRoom: string | undefined, ws: WebSocket, onlineUsers: number[] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { data: session } = useSession();
  const currentUserId = parseInt(session?.user?.id as string);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if(selectedRoom === undefined || selectedUser === undefined){
    return(
      <>
      <div className='w-full flex justify-center items-center space-y-2' >
        select user to chat
      </div>
      </>
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
  }, [messages]);

  useEffect(()=>{
    setMessages(prev => [...prev,incomingMessage])
  },[incomingMessage])

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a user to start chatting</p>
      </div>
    )
  }

  async function handleMessage(data:string) {
    if(data.trim() == ""){
      return;
    }
    const senderMessage:Message = {
      from : currentUserId,
      content : data
    };
    ws.send(JSON.stringify({ type: "message", message:senderMessage, roomId: selectedRoom }))
    setMessages(prev => [...prev,senderMessage])
    await uploadOnRedis(senderMessage,selectedRoom!)
    setInputMessage("")
    console.log(messages);
  }

  return (
    // header
    <div className="flex flex-col h-full bg-background">
      <div className='p-4 flex items-center border-b sticky top-0 bg-card z-10'>
        <Avatar>
          <AvatarImage className='bg-zinc-800' src={selectedUser.avatar as string} />
        </Avatar>
        <div className='ml-3 font-medium'>
          {selectedUser.username}
          <div className='text-zinc-100 font-light ' >
            {onlineUsers.find(userId => userId == selectedUser.id) ? `online` : `offline`}
          </div>
        </div>
      </div>
      {/* message dispaly  */}
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}>
            <Card className={`max-w-[70%] ${msg.from === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <CardContent className="p-3 break-words">
                {msg.content}
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      {/* message input */}
      <div className='p-4 border-t bg-card'>
        <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); handleMessage(inputMessage) }}>

          <Input
            type='text'
            className="flex-grow"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => { setInputMessage(e.target.value);}}
          />
          <Button type="submit" variant={"default"} >Send</Button>
        </form>
      </div>
    </div>
  )
}

export default ChattingUser;
