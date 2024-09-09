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
})

async function getUser(email: string): Promise<User | any> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function Register(data : FormData){
  const getData = {
    email : data.get("email"),
    password : data.get("password"),
    firstName : data.get("firstName"),
    lastName : data.get("lastName")
  }
  const parsedCredential = UserSignUpSchema.safeParse(getData);
  if(!parsedCredential.success){
    throw new Error("Invalid Credentials" + parsedCredential.error);
  }

  const { email, firstName,lastName,password } = parsedCredential.data;
  const user = await getUser(email);
  if(user){
    throw new Error("user from this user already exists");
  }

  const hashedPassword = bcrypt.hashSync(password,10);

  await prisma.user.create({
    data:{
      username:"usernameNahiHaiBhai",
      email:email,
      password: hashedPassword,
      firstName:firstName,
      lastName:lastName as string,
    }
  })
}

export async function LoginHandler(data:FormData){
  const getData = {
    email : data.get("email"),
    password : data.get("password"),
  }
  const {email, password} = getData
  try{
  await signIn("credentials",{
    email,
    password,
    redirect : true,
    redirectTo : "/dashboard",
  });
  } catch(error){
    const err = error as CredentialsSignin;
    return err.message
  }
  console.log(getData);
}
