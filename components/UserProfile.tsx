import { getUser } from '@/lib/actions';
import { User } from '@/lib/schema';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!(status === "authenticated" && session?.user?.email)) {
      return;
    }
    async function gettingUserData() {
      const usersData = await getUser(session?.user?.email as string);
      setUserData(usersData);
    }
    gettingUserData();
  }, [session?.user?.email, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  const handleProfile = async()=>{
    router.push('/user/profile');
  }

  const handleSetting = async()=>{
    router.push('/user/setting');
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login'); 
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.avatar as string} alt={userData?.firstName || session.user?.name || 'User'} />
            <AvatarFallback>{(userData?.username || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData?.username || session.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData?.email || session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetting}  >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;