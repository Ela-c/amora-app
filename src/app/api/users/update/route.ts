import { NextResponse } from 'next/server';
import { UserDataAccess } from '@/persistance/user-data-access';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { SessionDataAccess } from '@/persistance/session-data-access';

// Define validation schema for update data
const updateUserSchema = z.object({
    id: z.string(),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
});

export async function PUT(request: Request) {
    try {
        // Check authentication
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session-id');
        if (!sessionCookie) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

         // Get session data
         const sessionResult = await SessionDataAccess.getUserSessionByToken(sessionCookie.value);
         if (!sessionResult.success || !sessionResult.session) {
             return NextResponse.json(
                 { error: 'Invalid session' },
                 { status: 401 }
             );
         }
 
         // Get user data from session
        const userResult = await UserDataAccess.getUserById(sessionResult.session.userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const sessionUser = userResult.user;

        // Parse request body
        const body = await request.json();
        console.log('Request body:', body);
        // Validate input data
        const validationResult = updateUserSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const updateData = validationResult.data;

        // Check authorization
        // Only admins can update other users or change roles
        if (sessionUser.id !== updateData.id) {
            if (sessionUser.role !== 'ADMIN') {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                );
            }
        }

        // Regular users cannot change their role
        if (sessionUser.role !== 'ADMIN' && updateData.role) {
            return NextResponse.json(
                { error: 'Forbidden: Cannot modify role' },
                { status: 403 }
            );
        }

        // If email is being updated, check if it's already in use
        if (updateData.email) {
            const existingUser = await UserDataAccess.getUserByEmail(updateData.email);
            if (existingUser.success && existingUser.user?.id !== updateData.id) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
        }
        // Update user
        const { id, ...updateFields } = updateData;
        const result = await UserDataAccess.updateUser(id, updateFields);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to update user' },
                { status: 500 }
            );
        }

        // Remove sensitive information before sending response
        const sanitizedUser = result.user && {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
        };

        return NextResponse.json(
            { user: sanitizedUser },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in PUT /api/users/update:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}