import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionDataAccess } from "@/persistance/session-data-access";

export async function GET() {
    try {
        const cookieStore = await cookies();

        // Delete session from database
        const deletionResult = await SessionDataAccess.deleteUserSession(cookieStore);
        
        if (!deletionResult.success) {
            return NextResponse.json(
                { error: deletionResult.error || "Failed to delete session" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}