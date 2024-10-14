"use server";
import { prisma } from "@/Client";
import { auth } from "@/auth";
import { ChatRoom } from "../schema";

export const ChatWithOtherUser = async (): Promise<ChatRoom[]> => {
    const session = await auth();
    const userId = parseInt(session?.user?.id as string);
    const chatRooms = await prisma.chatRoom.findMany({
        where: {
            ChatRoomUser: {
                some: {
                    userId: userId,
                },
            },
        },
        include: {
            ChatRoomUser: {
                include: {
                    user: {
                        select: {
                            email: true,
                            id: true,
                            username: true,
                            avatar: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                }
            }
        }
    });
    const chatRoomsWithOtherUsers = chatRooms.map(chatRoom => ({
        ...chatRoom,
        users: chatRoom.ChatRoomUser
            .map(chatRoomUser => chatRoomUser.user)
            .filter(user => user.id !== userId),
    }));
    return chatRoomsWithOtherUsers;
}

export const GetRoomMessage = async (roomId: string) => {
    const msgData = await prisma.message.findMany({
        where: {
            ChatRoomId: roomId
        },
        select: {
            content: true ,
            userId: true,
            ChatRoomId: true
        },
        orderBy : {
            createdAt :'asc'
        }
    });

    return msgData.map(msg=>({
        from : msg.userId,
        to : 0,
        content : msg.content
    }));

}