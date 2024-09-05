'use server';
import { z } from 'zod';
import bcrypt from "bcrypt";
import { prisma } from '@/Client';

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  const parsedCredential = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.optional(z.string())
  }).safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  });

  if (!parsedCredential.success) {
    return 'Invalid Data Provide';
  }

  const { email, password, firstName, lastName } = parsedCredential.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    if (existingUser) {
      return 'User with this mail is already exist.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        username: "@mehoona",
        firstName: firstName,
        lastName: lastName,
      }
    })
  } catch (error) {
    console.error('Failed to register user:', error);
    return "Registration Failed. Please try again"
  }

}
