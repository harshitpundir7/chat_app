'use server';
import { prisma } from "@/Client";
import { CredentialsSignin, User } from "next-auth";
import {  z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

const UserSignUpSchema = z.object({
  email : z.string().email(),
  firstName : z.string(),
  lastName : z.optional(z.string()),
  password : z.string().min(6),
  username : z.string()
})

export async function isUsernameAllowed(username:string):Promise<boolean>{
  try {
    const user = await prisma.user.findUnique({
      where:{
        username : username,
      },
    });
    if(user)return false;
  return true
  } catch (error) {
    return false
  }
}

async function getUser(email: string): Promise<User | any> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
}

export async function Register(data : FormData){
  const getData = {
    email : data.get("email"),
    password : data.get("password"),
    firstName : data.get("firstName"),
    lastName : data.get("lastName"),
    username : data.get("username")
  }
  const parsedCredential = UserSignUpSchema.safeParse(getData);
  if(!parsedCredential.success){
    return "Invalid Credentials";
  }

  const { email, firstName,lastName,password,username } = parsedCredential.data;
  const user = await getUser(email);
  if(user){
    return "user from this user already exists";
  }

  const hashedPassword = bcrypt.hashSync(password,10);

  await prisma.user.create({
    data:{
      username:username,
      email:email,
      password: hashedPassword,
      firstName:firstName,
      lastName:lastName as string,
    }
  })
  return false;
}

export async function LoginHandler(email:string,password:string){
  try{
  await signIn("credentials",{
    email,
    password,
  });
  } catch(error){
    const err = error as CredentialsSignin;
    return err.cause
  }
}
