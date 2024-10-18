"use client";
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getUser } from '@/lib/actions';
import { User } from '@/lib/schema';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<User | null>(null);
    const router = useRouter();

    useEffect(()=>{
      if (!(status === "authenticated" && session?.user?.email)) {
        return;
      }

      async function gettingUserData() {
        const usersData = await getUser(session?.user?.email as string);
        setUserData(usersData);
      }

      gettingUserData();
    },[session?.user?.email,status]);
  return (
    <>
    <div className='flex justify-center items-center' >
        <Avatar>
          <AvatarImage src={userData?.avatar as string} />
        </Avatar>
    </div>
    </>
  )
}

export default page