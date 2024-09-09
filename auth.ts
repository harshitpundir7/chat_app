import NextAuth, { CredentialsSignin, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "./Client";
import bcrypt from "bcryptjs";

const UserSchema = z.object({
  email : z.string().email(),
  password : z.string().min(6),
})

//get users func
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId:"adfadf",
      clientSecret:"fadkfadfa",
    }),
    Credentials({
      name : "Credentials",
      credentials : {
        email:{
          label:"Email",
          type:"email",
        },
        password:{
        label:"Password",
        type : "password",
      }
      },
      
      async authorize(credentials){
        console.log("action se yahan tak ane ka safar")
        const parsedCredential = UserSchema.safeParse(credentials);
        if(!parsedCredential.success){
          throw new CredentialsSignin({
            cause : "Invalid input"
          })
        }
        const {email,password} = parsedCredential.data;
        const user = await getUser(email);
        if(!user) {
          throw new CredentialsSignin({
            cause : "User doesn't exists"
          })
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
          throw new CredentialsSignin({
            cause : "Incorrect password"
          })
        }
        return user;
    }
    }),
  ],
  pages:{
    signIn : '/login',
  }
});
