import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { ChatWithOtherUser } from "@/lib/actions/ChatWithUser";

type Group = {
  id: number;
  name: string;
  unread: number;
};

type DirectMessage = {
  id: number;
  name: string;
  status: "online" | "offline";
  unread: number,
};

type SidebarSectionProps<T> = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};


const ChatSidebar: React.FC = () => {
  const [groupChat, setGroupChat] = useState<boolean>(false);
  const [singleChat, setSingleChat] = useState<boolean>(false);
  const { data: session, status } = useSession()

  useEffect(() => {
    const value = localStorage.getItem("ChatSidebar");
    if (value) {
      const data = JSON.parse(value)
      setGroupChat(data.groupChat)
      setSingleChat(data.singleChat)
    }

    async function getChatData() {
      const data = await ChatWithOtherUser()
      console.log(data);
    }
    getChatData();

  }, [])

  const groups: Group[] = [
    { id: 1, name: "group-one", unread: 3 },
    { id: 2, name: "group-two", unread: 0 },
  ];

  const directMessages: DirectMessage[] = [
    { id: 1, name: "John Doe", status: "online", unread: 0 },
    { id: 2, name: "Jane Smith", status: "offline", unread: 0 },
  ];

  const SidebarSection = <T,>({
    title,
    isOpen,
    onToggle,
    items,
    renderItem,
  }: SidebarSectionProps<T>) => (
    <div className="space-y-2 mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300/30 rounded-lg over:bg-white/5 transition-colors duration-200"
      >
        {isOpen ? (
          <ChevronUp className="h-4 w-4 " />
        ) : (
          <ChevronDown className="h-4 w-4 " />
        )}
        <span className="text-gray-300/40 font-medium flex-1 text-left">{title}</span>
      </button>

      {isOpen && <div className="space-y-1 pl-4">{items.map(renderItem)}</div>}
    </div>
  );

  return (
    <div className="px-4 py-2 space-y-4 ">
      <div className="flex w-full items-center justify-between py-3 px-2 cursor-pointer rounded-lg ">
        <h2 className="text-white font-semibold">Chat</h2>
        <button className="hover:bg-white/10 px-4 rounded-lg py-2 text-white/50 hover:text-white transition-all duration-300 cursor-pointer ">
          <span className="">+</span>
        </button>
      </div>

      <div className="">
        <SidebarSection<Group>
          title="Groups"
          isOpen={groupChat}
          onToggle={() => {
            const newGroupChat = !groupChat;
            setGroupChat(newGroupChat);
            localStorage.setItem("ChatSidebar", JSON.stringify({ groupChat: newGroupChat, singleChat }));
          }}
          items={groups}
          renderItem={(group) => (
            <button
              key={group.id}
              className="w-full flex items-center px-3 py-2 rounded-md hover:bg-white/5 text-gray-300/30 hover:text-white transition-colors duration-200"
            >
              <Hash className={`h-4 w-4 mr-2 ${group.unread > 0 && "text-white"} `} />
              <span className={`flex-1 text-left ${group.unread > 0 && "text-white"} `}>{group.name}</span>
              {group.unread > 0 && (
                <span className=" bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {group.unread}
                </span>
              )}
            </button>
          )}
        />

        <SidebarSection<DirectMessage>
          title="Direct Messages"
          isOpen={singleChat}
          onToggle={() => {
            const newSingleChat = !singleChat;
            setSingleChat(newSingleChat)
            localStorage.setItem("ChatSidebar", JSON.stringify({ groupChat, singleChat: newSingleChat }));
          }}
          items={directMessages}
          renderItem={(dm) => (
            <button
              key={dm.id}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300/30  hover:text-white transition-colors duration-200"
            >
              <div className="relative" >
                <Avatar className="h-8 w-8" >
                  <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className={`h-3 w-3 absolute border-2 border-DarkIndigo right-0 top-6 ${dm.status === "online" ? "bg-green-400" : "bg-gray-400"} rounded-full`} />
              </div>
              <span>{dm.name}</span>
            </button>
          )}
        />
      </div>
    </div >
  );
};

export default ChatSidebar;
