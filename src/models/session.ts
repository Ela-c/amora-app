import { z } from 'zod';

export const SessionSchema = z.object({
    sessionToken: z.string(), // UUID for session token
    userId: z.number(),
    createdAt: z.date(),
    expiresAt: z.date(),
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
});

export type UserSession = z.infer<typeof SessionSchema>;

export type Cookies = {
    get: (key: string) => {name: string; value: string} | undefined;
    set: (key: string, value: string, options?: { maxAge?: number; path?: string; domain?: string; secure?: boolean; httpOnly?: boolean, expires?: number, sameSite?: "strict" | "lax" }) => void;
    delete: (key: string) => void;
};