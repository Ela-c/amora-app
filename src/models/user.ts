import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid().optional(), // UUID for user ID
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    fullname: z.string().min(3).max(20).optional(), // Optional fullname field
    
}).strict(); // strict mode to ensure no additional properties are allowed

export const PasswordSchema = z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export type User = z.infer<typeof UserSchema>;
export type Password = z.infer<typeof PasswordSchema>;