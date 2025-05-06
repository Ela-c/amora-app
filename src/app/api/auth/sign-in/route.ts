import { NextRequest, NextResponse } from 'next/server';
import { UserDataAccess } from '@/persistance/user-data-access';
import { SessionDataAccess } from '@/persistance/session-data-access';
import { PasswordHasher } from '@/lib/auth/password-hasher';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { PasswordSchema } from '@/models/user';

// Define validation schema for sign-in data
const signInSchema = z.object({
    email: z.string().email(),
    password: PasswordSchema,
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input data
        const validationResult = signInSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // Get user by email
        const userResult = await UserDataAccess.getUserByEmail(email);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
        console.log(userResult.user);
        // Verify password
        const passwordMatch = await PasswordHasher.verify(
            password,
            userResult.user.passwordHash
        );

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Get user agent and IP address
        const userAgent = request.headers.get('user-agent');        
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0];

        // Check for existing session
        const cookieStore = await cookies();
        const existingSessionCookie = cookieStore.get('session-id');

        if (existingSessionCookie) {
            // Delete existing session
            await SessionDataAccess.deleteUserSession(cookieStore);
        }

        // Create new session
        const sessionResult = await SessionDataAccess.createUserSession(
            {
                id: userResult.user.id ?? "", // id will never be null if it comes from the database
                user_agent: userAgent,
                ip_address: ip
            },
            cookieStore
        );

        if (!sessionResult.success) {
            return NextResponse.json(
                { error: 'Failed to create session' },
                { status: 500 }
            );
        }

        // Prepare user data for response
        const sanitizedUser = {
            id: userResult.user.id,
            email: userResult.user.email,
            firstName: userResult.user.firstName,
            lastName: userResult.user.lastName,
            role: userResult.user.role,
            createdAt: userResult.user.createdAt,
            updatedAt: userResult.user.updatedAt
        };

        return NextResponse.json(
            {
                user: sanitizedUser,
                message: 'Sign in successful'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in POST /api/auth/sign-in:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}