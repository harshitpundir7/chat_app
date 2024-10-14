import { z } from "zod";
export const UserSignUpSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.optional(z.string()),
  password: z.string().min(6),
  username: z.string(),
});
export type EmailInputData = {
  email: string;
  firstname: string;
  otp: number;
};
export type UserSignUp = z.infer<typeof UserSignUpSchema>;