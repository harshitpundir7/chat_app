"use client";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { filterUsers } from "@/lib/actions/filterUsers";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/schema";



export default function SearchUsername({ setSelectedUser,setSelectedRoom }: any) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [query,setQuery] = useState('');

  //toggle open/close with shortcut
  useEffect(() => {
    const KeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    }
    document.addEventListener("keydown", KeyboardEvent);
    return () => document.removeEventListener("keydown", KeyboardEvent);
  },[])

  //handle user selection
  async function handleUserSelect(clickerUser: User) {
    try {
      const response = await fetch('/api/userAdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedUserId: clickerUser.id })
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      
      setSelectedRoom(data.chatRoom.id)
      setSelectedUser(clickerUser);
      setOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  //handle input change and filter user
  async function handleChange(query: string) {
    setQuery(query);
    const filteredUsers = await filterUsers(query);
    setUsers(filteredUsers);
    console.log(users);
  }


  return (
    <>
      <p className="text-sm text-muted-foreground cursor-pointer " onClick={()=>setOpen(true)}>
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100" >
          <span className="text-xs">⌘</span>J
        </kbd>
        {" "}to search username
      </p>
      <CommandDialog open={open} onOpenChange={setOpen} >
        <CommandInput
          value={query}
          onValueChange={handleChange}
          placeholder="search username..." />
            <CommandList>
          {users.length === 0 ? (
            <CommandEmpty>No results found</CommandEmpty>
          ) : (
            users.map((user) => (
              <CommandItem
                key={user.id}
                className="cursor-pointer"
                onSelect={() => handleUserSelect(user)}
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={user.avatar as string} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">{user.username}</div>
                </div>
              </CommandItem>
            ))
            )
          }
          </CommandList>
      </CommandDialog>
    </>
  )
}

