import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatRoom, Message, User } from '@/lib/types'
import { Avatar, AvatarImage } from './ui/avatar'
import { BorderBeam } from './border-beam'
import { Paperclip, SendHorizontal } from 'lucide-react'
import { type } from 'os'

interface ExtendedUser extends User {
  isOnline: boolean;
}

interface ExtendedChatRoom extends ChatRoom {
  users: ExtendedUser[];
}

interface ConversationalPanelProps {
  activeChat: ExtendedChatRoom
  ws: WebSocket
  incomingMessage: Message
  userId: number
}

const ConversationalPanel: React.FC<ConversationalPanelProps> = ({ activeChat, ws, incomingMessage, userId }) => {
  const [activeUser, setActiveUser] = useState<ExtendedUser>()
  const [focusedInput, setFocusedInput] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messageData, setMessageData] = useState<Message[]>([])
  const messageEndRef = useRef<HTMLDivElement>(null)

  function scrolltoBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  //load activeChat
  useEffect(() => {
    if (activeChat && !activeChat.isGroup && activeChat.users.length > 0) {
      setActiveUser(activeChat.users.filter(user => user.id != userId)[0]);
    }
  }, [activeChat]);

  //load incomingMessage
  useEffect(() => {
    if (incomingMessage && Object.keys(incomingMessage).length !== 0) {
      setMessageData(prev => [...prev, incomingMessage])
    }
  }, [incomingMessage])

  //load messageData
  useEffect(() => {
    scrolltoBottom();
  }, [messageData])

  if (!activeUser) {
    return (
      <div className='flex justify-center items-center text-gray-300/50'>
        Start chatting
      </div>
    )
  }

  function handleMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputMessage.trim()) {
      ws.send(JSON.stringify({
        type: "message",
        message: inputMessage.trim(),
        roomId: activeChat.id,
        from: userId
      }))
      setMessageData(prev => [...prev, { content: inputMessage.trim(), from: userId }])
      setInputMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-DarkIndigo">
      {/* Header */}
      <div className="relative">
        <motion.div
          className="w-full border-b border-white/10 px-6 py-4 flex items-center space-x-4 bg-DarkNavy/50 cursor-pointer"
          onHoverStart={() => setShowUserInfo(true)}
          onHoverEnd={() => setShowUserInfo(false)}
          animate={{
            backgroundColor: showUserInfo ? 'rgba(7, 7, 32, 0.95)' : 'rgba(7, 7, 32, 0.5)',
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{
              scale: showUserInfo ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src=
                {
                  // activeUser?.avatar || 
                  "https://github.com/shadcn.png"} />
            </Avatar>
          </motion.div>

          <div className="flex flex-col">
            <span className="text-white font-medium">{activeUser?.username}</span>
            <span className={`text-sm ${activeUser?.isOnline ? 'text-green-400' : 'text-white/50'}`}>
              {activeUser?.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </motion.div>

        <UserInfoOverlay user={activeUser} isVisible={showUserInfo} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="relative h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messageData.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isOwn={message.from === userId}
              />
            ))}
            <div ref={messageEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="relative rounded-lg overflow-hidden">
              <form onSubmit={(e) => handleMessage(e)} >
                <div className="flex items-center relative rounded-lg border focus-within:border-white/20">
                  {focusedInput && <BorderBeam size={1000} duration={6} delay={4} />}
                  <button className="absolute left-2 p-2 z-10 hover:bg-white/10 rounded-full transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <input
                    placeholder="Type a message..."
                    className="flex-1 pl-14 bg-white/5 backdrop-blur-md px-4 py-3 focus:outline-none text-white/90 placeholder:text-white/20"
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />

                  <button type='submit' className="p-3 hover:bg-white/10 rounded-r-lg transition-colors">
                    <SendHorizontal className="h-5 w-5 text-white/70" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ConversationalPanel


const UserInfoOverlay = ({ user, isVisible }: { user: ExtendedUser; isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="absolute top-full left-0 right-0 backdrop-blur-md bg-DarkNavy/95 border-b border-white/10"
      >
        <motion.div
          className="p-6 space-y-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className='relative rounded-full p-1'
            >
              <BorderBeam size={140} duration={4} />
              <Avatar className="h-20 w-20 ring-2 ring-offset-1 ring-offset-DarkNavy ring-white/20">
                <AvatarImage src={"https://github.com/shadcn.png"} />
              </Avatar>
            </motion.div>

            <div className="space-y-2">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-medium text-white">
                  {user.firstName} {user.lastName}
                </h2>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60"
              >
                @{user.username}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm text-white/50">{user.email}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={isOwn ? "your-avatar.png" : "https://github.com/shadcn.png"} />
      </Avatar>
      <div
        className={`px-4 py-2 rounded-2xl ${isOwn
          ? 'bg-indigo-600 text-white rounded-br-none'
          : 'bg-white/10 text-white/90 rounded-bl-none'
          }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  </motion.div>
)
