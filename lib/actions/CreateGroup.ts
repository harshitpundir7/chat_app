"use server";

import { auth } from "@/auth";
import { prisma } from "@/Client";
import { ChatRoom } from "@prisma/client";
import { NextResponse } from "next/server";

async function CreateGroup(userIds: number[], groupName: string) {
  const session = await auth()
  const userId = parseInt(session?.user?.id!)
  userIds.push(userId)

  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        name: groupName,
        isGroup: true,
        users: {
          connect: userIds.map((id) => ({ id })),
        },
        ChatRoomUser: {
          create: userIds.map((id) => ({
            user: { connect: { id } },
          })),
        },
      },
      include: { users: true }
    });
    return chatRoom
  } catch (e) {
    console.log("error creating group chat room", e)
  }
}
export async function CreateRoom(user2Id: number): Promise<ChatRoom | undefined> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    NextResponse.redirect("/login")
    return;
  }
  const user1Id = parseInt(userId)
  const usersId = [user1Id, user2Id]
  try {
    const existingChatRoom = await prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        ChatRoomUser: {
          every: {
            userId: {
              in: usersId,
            },
          },
        },
      },
      include: { ChatRoomUser: true, users: true }
    })

    if (existingChatRoom) {
      return existingChatRoom as ChatRoom
    }

    //create room for both users
    const newChatRoom = await prisma.chatRoom.create({
      data: {
        isGroup: false,
        name: null,
        ChatRoomUser: {
          create: [
            { userId: user1Id },
            { userId: user2Id },
          ],
        },
        users: {
          connect: [
            { id: user1Id },
            { id: user2Id },
          ],
        },
      },
      include: {
        ChatRoomUser: true,
        users: true,
      },
    });

    return newChatRoom;
  } catch (error) {
    console.error("Error while creating chat room with users: ", error);
    return;
  }
}
export default CreateGroup
