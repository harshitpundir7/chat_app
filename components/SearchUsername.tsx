"use client";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { filterUsers } from "@/lib/actions/filterUsers";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/schema";
import { Search, Command } from "lucide-react";
import { Button } from "./ui/button";

export default function SearchUsername({ setSelectedUser, setSelectedRoom }: any) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => document.removeEventListener("keydown", handleKeyboardEvent);
  }, []);

  async function handleUserSelect(selectedUser: User) {
    try {
      const response = await fetch('/api/userAdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedUserId: selectedUser.id })
      });
      if (!response.ok) throw new Error('Failed to add user');
      const data = await response.json();
      setSelectedRoom(data.chatRoom.id);
      setSelectedUser(selectedUser);
      setOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      // Consider adding a user-friendly error message here
    }
  }

  async function handleChange(query: string) {
    setQuery(query);
    const filteredUsers = await filterUsers(query);
    setUsers(filteredUsers);
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search users...</span>
        <span className="sr-only">Search users</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={handleChange}
          placeholder="Search username..."
        />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {users.map((user) => (
            <CommandItem
              key={user.id}
              onSelect={() => handleUserSelect(user)}
              className="cursor-pointer hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar as string} alt={user.username} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  {user.email && <span className="text-sm text-muted-foreground">{user.email}</span>}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}