import { NextResponse } from 'next/server';
import { UserDataAccess } from '@/persistance/user-data-access';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth/auth-options';

export async function GET() {
    try {
        // // Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        // // Check if user has admin role
        // if (session.user.role !== 'ADMIN') {
        //     return NextResponse.json(
        //         { error: 'Forbidden' },
        //         { status: 403 }
        //     );
        // }

        // Get all users from database
        const result = await UserDataAccess.getAllUsers();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to fetch users' },
                { status: 500 }
            );
        }

        // Remove sensitive information before sending response
        const sanitizedUsers = result.users?.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        return NextResponse.json(
            { users: sanitizedUsers },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in GET /api/users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}