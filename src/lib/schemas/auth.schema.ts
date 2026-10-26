import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type signUpFormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type signInFormValues = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
    code: z.string().min(1, "Code is required")
})

export type CodeFormSchema = z.infer<typeof codeSchema>;