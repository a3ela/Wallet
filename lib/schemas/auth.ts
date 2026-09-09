import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email.")),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email.")),
  password: z.string().min(1, { message: "Password is required" }),
});
export type SignInFormSchema = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
  code: z.string().trim().min(1, { message: "Code is required" }),
});
export type CodeFormSchema = z.infer<typeof codeSchema>;
