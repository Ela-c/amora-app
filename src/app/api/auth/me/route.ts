import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SessionDataAccess } from '@/persistance/session-data-access';
import { UserDataAccess } from '@/persistance/user-data-access';

export async function GET(request: NextRequest) {
    try {
        // Get session token from cookies
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session-id');
        console.log('Session cookie:', sessionCookie);
        if (!sessionCookie) {
            console.log('No session cookie found');
            return NextResponse.json(
                { error: 'Unauthorized - No session found' },
                { status: 401 }
            );
        }

        // Validate session
        const sessionResult = await SessionDataAccess.getUserSessionByToken(sessionCookie.value);
        if (!sessionResult.success || !sessionResult.session) {
            console.log('Invalid session token');
            return NextResponse.json(
                { error: 'Unauthorized - Invalid session' },
                { status: 401 }
            );
        }

        // Check if session is expired
        const now = new Date();
        if (new Date(sessionResult.session.expiresAt) < now) {
            // Delete expired session
            const deletionResult = await SessionDataAccess.deleteUserSession(cookieStore);
            if (!deletionResult.success) {
                console.log('Failed to delete expired session');
                return NextResponse.json(
                    { error: 'Failed to delete expired session' },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { error: 'Unauthorized - Session expired' },
                { status: 401 }
            );
        }

        // Get user data
        const userResult = await UserDataAccess.getUserById(sessionResult.session.userId);
        if (!userResult.success || !userResult.user) {
            console.log('User not found for ID:', sessionResult.session.userId);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return sanitized user data
        const sanitizedUser = {
            id: userResult.user.id,
            email: userResult.user.email,
            firstName: userResult.user.firstName,
            lastName: userResult.user.lastName,
            role: userResult.user.role,
        };

        return NextResponse.json(sanitizedUser, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/auth/me:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}