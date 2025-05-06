import { NextRequest, NextResponse } from "next/server";
import { PasswordSchema, UserSchema } from "@/models/user";
import { UserDataAccess } from "@/persistance/user-data-access";

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const unsafeUserData = body;

        // Check required fields
        if (!unsafeUserData.email || !unsafeUserData.password || !unsafeUserData.firstName || !unsafeUserData.lastName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate unsafe user data
        const safeUserData = UserSchema.safeParse({
            email: unsafeUserData.email,
            firstName: unsafeUserData.firstName,
            lastName: unsafeUserData.lastName,
        });
        if (!safeUserData.success) {
            return NextResponse.json(
                { error: "Invalid user data", details: safeUserData.error },
                { status: 400 }
            );
        }
        const safePassword = PasswordSchema.safeParse(unsafeUserData.password);
        if (!safePassword.success) {
            return NextResponse.json(
                { error: "Invalid password", details: safePassword.error },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await UserDataAccess.getUserByEmail(safeUserData.data.email);
        if (existingUser.success) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Create new user
        const userResponse = await UserDataAccess.createUser({
            email: safeUserData.data.email,
            password: safePassword.data,
            firstName: safeUserData.data.firstName,
            lastName: safeUserData.data.lastName,
        });

        if (!userResponse.success) {
            return NextResponse.json(
                { error: userResponse.error },
                { status: 500 }
            );
        }
        const user = userResponse.user;
        if (!user) {
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }
        // Return success response (exclude sensitive data)
        return NextResponse.json(
            {
                message: "User created successfully",
                user: user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}