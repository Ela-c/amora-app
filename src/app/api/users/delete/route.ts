import { NextRequest, NextResponse } from "next/server";
import { UserDataAccess } from "@/persistance/user-data-access";

export async function DELETE(request: NextRequest) {
    try {
        // Extract the ID from the URL search params
        const searchParams = request.nextUrl.searchParams;
        const unsafeId = searchParams.get("id");

        // Validate the ID
        if (!unsafeId || !/^[a-z0-9]+$/.test(unsafeId)) {
            return NextResponse.json(
            { error: "Invalid or missing user ID. ID must contain only lowercase letters and numbers" },
            { status: 400 }
            );
        }

        const safeId = unsafeId; // Assuming the ID is already a string
        // Delete the user
        const deletedResponse = await UserDataAccess.deleteUser(safeId);

        if (!deletedResponse.success) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}